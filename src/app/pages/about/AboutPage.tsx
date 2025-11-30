"use client";

import AccordionComponent from "@/app/components/accordion";
import Header from "@/app/components/header";

interface CosmicSection {
  id: string;
  metadata: {
    header: string;
    body_text: string;
    image?: {
      imgix_url?: string;
      url?: string;
    };
  };
}

interface CosmicData {
  metadata: {
    title?: string;
    sections?: CosmicSection[];
  };
}

interface AboutPageProps {
  cosmic: CosmicData | null;
  valuesSection: null;
}

export default function AboutPage({ cosmic }: AboutPageProps) {
  // Fallback content if Cosmic data is not available
  const fallbackItems = [
    {
      id: "item-1",
      title: "Our Mission",
      content:
        "YOYOBRYTE's mission is to support the self-empowerment of refugee youth by providing academic tutoring and mentoring, as well as by fostering community among students who share experiences of resettlement in the United States.",
    },
    {
      id: "item-2",
      title: "Our Values",
      content: (
        <>
          <strong>Whole Child, Whole Families, Whole Care </strong>
          <br />
          We recognize that no child learns in a vacuum. Every child's
          wellbeing, ability to learn, and life at home are deeply intertwined.
          We also recognize that every child is different, with unique needs,
          strengths, histories of trauma, and relationships to school. For these
          reasons, we provide one-on-one tutoring and mentoring and commit to
          meeting our youth where they are and as they are. Our goal is overall
          wellness, rather than a sharp focus exclusively on academic outcomes.
          <br />
          <br />
          <strong>Student Leadership</strong>
          <br />
          We are a group of undergraduate, medical, and public health students,
          who are also advised by a board of high school-aged alumni of BRYTE.
          We believe in the unique power, energy, and creativity of student
          organizations and student movements. We believe student leadership
          benefits everybody in our program, creating deep relationships that
          transform both refugee youth and students in higher education.
          <br />
          <br />
          <strong>Longitudinal Relationships</strong>
          <br />
          We recognize that every refugee child and refugee family has a unique
          journey to adapting and thriving in a new environment. For this
          reason, we work with both newly-arrived youth and youth who have lived
          in the United States for some time. We do not adhere to a fixed policy
          at which we "phase out" our youth but address each case on an
          individualized basis. We form deep relationships with our students and
          families that often last long beyond tutoring. As our students grow,
          we create opportunities for them to exercise leadership and service in
          their communities.
          <br />
          <br />
          <strong>Self-Reflection and Accountability</strong>
          <br />
          We diligently document our work and create layers of accountability at
          every step. Our work is supervised and closely advised by experts, and
          we engage in formal didactic trainings alongside our
          learning-by-doing. We are transparent about how we spend our resources
          and regularly report our process and outcome measures to our
          supporters. We evaluate our impact both quantitatively and
          qualitatively and practice deep self-reflection, striving always to
          improve our work.
          <br />
          <br />
          <strong>Soul</strong>
          <br />
          We recognize that it is impossible to engage in this work without
          being deeply moved by it. We are here to share ourselves with our
          youth and to create the space for them to share themselves with us and
          with each other. We embrace emotional honesty, joy, and above all,
          love.
        </>
      ),
    },
  ];

  // Map Cosmic sections → your accordion format (or use fallback)
  const sections = cosmic?.metadata?.sections || [];
  
  const aboutItems = sections.length > 0
    ? sections.map((section, index) => ({
        id: section.id || `item-${index + 1}`,
        title: section.metadata?.header || "",
        content: (
          <div
            dangerouslySetInnerHTML={{ __html: section.metadata?.body_text || "" }}
          />
        ),
      }))
    : fallbackItems;

  // Find a section with an image for the bottom Section component (not used anymore)
  const sectionWithImage = sections.find(
    (section) => section.metadata?.image?.imgix_url || section.metadata?.image?.url
  );

  return (
    <>
      <Header />

      <AccordionComponent
        title={cosmic?.metadata?.title || "About Bryte!"}
        items={aboutItems}
      />
    </>
  );
}
