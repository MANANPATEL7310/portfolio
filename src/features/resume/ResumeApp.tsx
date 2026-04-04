import {
  Download,
  Minus,
  PanelLeft,
  Plus,
  Printer,
  RotateCcw,
  Search,
} from "lucide-react";

export function ResumeApp() {
  return (
    <div className="flex h-full flex-col bg-[#2f2f33] text-white">
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#232327] px-4 text-white/75">
        <div className="flex items-center gap-3">
          <PanelLeft className="h-4 w-4" />
          <span className="text-[12px] font-semibold text-white/75">Resume</span>
        </div>

        <div className="flex items-center gap-3 text-[12px]">
          <span className="rounded border border-white/10 bg-black/30 px-1.5 py-0.5">1 / 2</span>
          <Minus className="h-3.5 w-3.5" />
          <span>100%</span>
          <Plus className="h-3.5 w-3.5" />
        </div>

        <div className="flex items-center gap-3">
          <Search className="h-4 w-4" />
          <RotateCcw className="h-4 w-4" />
          <Download className="h-4 w-4" />
          <Printer className="h-4 w-4" />
        </div>
      </div>

      <div className="hide-scrollbar flex-1 overflow-auto bg-[#34343a] px-5 py-5">
        <article className="mx-auto max-w-[560px] overflow-hidden rounded-[0.9rem] bg-white text-[#222] shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
          <header className="grid grid-cols-[1.2fr_1fr]">
            <div className="bg-[#373332] px-11 py-11 text-white">
              <h1 className="font-serif text-[32px] font-bold uppercase leading-[0.95] tracking-tight">
                Ian
                <br />
                Hansson
              </h1>
            </div>
            <div className="bg-[#0f8596] px-8 py-11 text-white">
              <p className="text-[16px] font-medium">Graphic Designer</p>
              <p className="mt-2 text-[16px] font-semibold">UI/UX Engineer</p>
              <p className="mt-2 text-[16px]">Developer</p>
            </div>
          </header>

          <section className="grid grid-cols-[1.2fr_1fr]">
            <div>
              <div className="bg-[#0f8596] px-11 py-3 text-[14px] font-semibold uppercase tracking-wide text-white">
                Profile
              </div>
              <div className="px-11 py-7 text-[12px] leading-5 text-[#4b5563]">
                Enthusiastic and creative graphic designer with a passion for translating ideas into visually compelling designs.
                With experience in both print and digital mediums, I thrive on bringing concepts to life through innovative and impactful visuals.
              </div>

              <div className="bg-[#0f8596] px-11 py-3 text-[14px] font-semibold uppercase tracking-wide text-white">
                Experience
              </div>
              <div className="space-y-6 px-11 py-6 text-[12px] leading-5 text-[#4b5563]">
                <div>
                  <p className="text-[14px] font-semibold text-[#303030]">Adatum Corporation</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0f8596]">20XX - Present</p>
                  <p className="mt-2">
                    Developed and evolved brand identities, crafted compelling collateral, oversaw end-to-end project lifecycles, and contributed to award-winning campaigns.
                  </p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#303030]">Proseware, Inc.</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0f8596]">20XX - 20XX</p>
                  <p className="mt-2">
                    Collaborated across disciplines on typography systems, product visuals, and motion assets that improved clarity and presentation quality.
                  </p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#303030]">Relecloud</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0f8596]">20XX - 20XX</p>
                  <p className="mt-2">
                    Built campaigns and design explorations that strengthened visual consistency and helped turn complex concepts into clear experiences.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-[#4a4747] px-8 py-3 text-[14px] font-semibold uppercase tracking-wide text-white">
                Contact
              </div>
              <div className="space-y-3 px-8 py-7 text-[12px] text-[#4b5563]">
                <p>816-555-0146</p>
                <p>ian_hansson</p>
                <p className="text-[#0f8596]">hansson@example.com</p>
                <p className="text-[#0f8596]">www.example.com</p>
              </div>

              <div className="bg-[#4a4747] px-8 py-3 text-[14px] font-semibold uppercase tracking-wide text-white">
                Skills
              </div>
              <ul className="space-y-1 px-8 py-6 text-[12px] leading-5 text-[#0f8596]">
                <li>Design software</li>
                <li>Typography</li>
                <li>UI/UX design</li>
                <li>Print design</li>
                <li>Project management</li>
                <li>Creative problem solving</li>
                <li>Communication skills</li>
              </ul>

              <div className="bg-[#4a4747] px-8 py-3 text-[14px] font-semibold uppercase tracking-wide text-white">
                Education
              </div>
              <div className="space-y-5 px-8 py-6 text-[12px] leading-5 text-[#4b5563]">
                <div>
                  <p className="text-[14px] font-semibold text-[#303030]">Graphic Design Institute</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0f8596]">20XX - 20XX</p>
                  <p>Master of Fine Arts, Graphic Design</p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#303030]">Jasper University</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0f8596]">20XX - 20XX</p>
                  <p>Bachelor of Arts, Graphic Design</p>
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
