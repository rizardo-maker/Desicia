import { z } from "zod";
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.email("Enter a valid work email.").max(200),
  company: z.string().trim().min(2, "Enter your company name.").max(160),
  priority: z.enum(["AI analytics", "AI automation", "AI transformation"]),
  context: z.string().trim().max(2000).default(""),
  consent: z.literal(true, {
    error: "Please agree to the request data notice.",
  }),
  website: z.string().max(0).default(""),
});
export type Lead = z.infer<typeof leadSchema>;
export function capacityModel(
  people: number,
  hours: number,
  rate: number,
  recovery: number,
) {
  const weeklyHours =
    (Math.max(0, people) *
      Math.max(0, hours) *
      Math.min(100, Math.max(0, recovery))) /
    100;
  return { weeklyHours, annualValue: weeklyHours * 48 * Math.max(0, rate) };
}
