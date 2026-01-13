"use server";

import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { RequireUser } from "@/app/data/user/require-user";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { aj, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const arcjet = aj.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function enrollInCourse(
  courseId: string
): Promise<ApiResponse | never> {
  const user = await RequireUser();
  let checkoutUrl: string;
  try {
    const req = await request();
    const decision = await arcjet.protect(req, { fingerprint: user.id });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests",
      };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        stripePriceId: true,
      },
    });
    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }
    let stripeCustomerId: string;
    const userWithStripeCustomer = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });
    if (userWithStripeCustomer?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomer.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: stripeCustomerId,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: { userId: user.id, courseId: courseId },
        },
        select: {
          status: true,
          id: true,
        },
      });
      if (existingEnrollment?.status === "Active") {
        return {
          status: "success",
          message: "You are already enrolled in this course",
        };
      }

      let enrollment;
      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            status: "Pending",
            amount: course.price,
            updatedAt: new Date(),
          },
          select: {
            status: true,
            id: true,
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: courseId,
            amount: course.price,
            status: "Pending",
          },
          select: {
            status: true,
            id: true,
          },
        });
      }
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [{ price: course.stripePriceId, quantity: 1 }],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/courses/${course.slug}`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });
      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSession.url,
      };
    });
    checkoutUrl = result.checkoutUrl as string;
  } catch (error) {
    console.log(error);
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Payment system error. Please try again later",
      };
    }

    return {
      status: "error",
      message: "Something went wrong",
    };
  }

  redirect(checkoutUrl);
}
