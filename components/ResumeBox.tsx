import React from "react";

const ResumeBox = () => {
  return (
    <div className="editorial-surface mx-auto max-w-2xl rounded-2xl p-6 text-ink sm:p-8">
      <header className="flex items-center mb-8">
        {/* <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mr-6"
        /> */}
        <div>
          <h1 className="text-3xl font-bold">Sherry Betts</h1>
          <p className="text-primaryStrong">Web-Designer</p>
          <div className="mt-2">
            <p className="text-subtle">📧 kodicharles@text.me</p>
            <p className="text-subtle">📍 2207 Beach Avenue, Los Angeles</p>
            <p className="text-subtle">🌐 behance.com/sherrybetts</p>
            <p className="text-subtle">📞 (914) 479-6342</p>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <p className="text-subtle">
          Graphic designer with +8 years of experience in branding and print
          design. Skilled at Adobe Creative Suite (Photoshop, Illustrator,
          InDesign) as well as sketching and hand drawing. Supervised 23 print
          design projects that resulted in an increase of 32% in savings.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold mb-2">Skills</h2>
          <ul className="list-disc pl-4 text-subtle">
            <li>Figma</li>
            <li>Sketch</li>
            <li>Photoshop</li>
            <li>Illustrator</li>
            <li>After Effects</li>
            <li>HTML/CSS</li>
            <li>Indesign</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Education</h2>
        <div className="mb-4">
          <p className="font-bold">2005 – 2007</p>
          <p className="text-subtle">Los Angeles University</p>
          <p className="text-subtle">
            Bachelor of Fine Arts in Graphic Design, GPA: 3.4/4.0
          </p>
        </div>
        <div>
          <p className="font-bold">2007 – 2012</p>
          <p className="text-subtle">New York University</p>
          <p className="text-subtle">
            Master of Graphic Design, GPA: 3.8/4.0
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Employment</h2>
        <div className="mb-4">
          <p className="font-bold">2012 – 2015</p>
          <p className="text-subtle">
            UI Designer at Market Studios, Los Angeles
          </p>
          <p className="text-subtle">
            Successfully translated subject matter into concrete design for
            newsletters, promotional materials and sales collateral. Created
            design theme and graphics for marketing and sales presentations,
            training videos and corporate websites.
          </p>
        </div>
        <div className="mb-4">
          <p className="font-bold">2015 – 2017</p>
          <p className="text-subtle">
            Graphic Designer at FireWeb, Los Angeles
          </p>
          <p className="text-subtle">
            Developed numerous marketing programs (logos, brochures,
            newsletters, infographics, presentations, and advertisements) and
            guaranteed that they exceeded the expectations of our clients.
          </p>
        </div>
        <div>
          <p className="font-bold">2018 – 2019</p>
          <p className="text-subtle">
            Graphic Designer at 5Tech, Los Angeles
          </p>
          <p className="text-subtle">
            Created new design themes for marketing and collateral materials.
            Collaborated with creative team to design and produce
            computer-generated artwork for marketing and promotional materials.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ResumeBox;
