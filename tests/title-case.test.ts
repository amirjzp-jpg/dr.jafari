import { describe, expect, it } from "vitest";
import { displayTitle, titleCase } from "@/lib/title-case";

describe("English title case", () => {
  it("capitalises the important words and keeps short function words lower case", () => {
    expect(titleCase("Cosmetic dentistry in Shiraz, Iran")).toBe("Cosmetic Dentistry in Shiraz, Iran");
    expect(titleCase("Composite bonding or ceramic (porcelain) veneers?")).toBe("Composite Bonding or Ceramic (Porcelain) Veneers?");
    expect(titleCase("How long does teeth whitening last?")).toBe("How Long Does Teeth Whitening Last?");
    expect(titleCase("Caring for ceramic (porcelain) veneers after treatment")).toBe("Caring for Ceramic (Porcelain) Veneers After Treatment");
  });

  it("capitalises after a colon and keeps names and abbreviations", () => {
    expect(titleCase("Plan your visit to Shiraz: how long treatments take")).toBe("Plan Your Visit to Shiraz: How Long Treatments Take");
    expect(titleCase("Cosmetic dentistry in Shiraz, Iran | Dr. Fatemeh Jafari")).toBe("Cosmetic Dentistry in Shiraz, Iran | Dr. Fatemeh Jafari");
    expect(titleCase("Book an appointment at Dr. Fatemeh Jafari's clinic, Shiraz")).toBe("Book an Appointment at Dr. Fatemeh Jafari's Clinic, Shiraz");
  });

  it("ends a title on a capital even when it is a short word", () => {
    expect(titleCase("What is it for")).toBe("What Is It For");
  });

  it("leaves Persian and Arabic untouched", () => {
    expect(displayTitle("fa", "خدمات کلینیک")).toBe("خدمات کلینیک");
    expect(displayTitle("ar", "خدمات العيادة")).toBe("خدمات العيادة");
    expect(displayTitle("en", "clinic services")).toBe("Clinic Services");
  });
});
