"use client";

import AccordionComponent from "@/app/components/accordion";
import Header from "@/app/components/header";
import Section from "@/app/components/section/section";
import "./about.css";
import Masthead from "@/app/components/masthead/masthead";

interface CosmicSection {
  id: string;
  slug?: string;
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

interface Person {
  id: string;
  title: string;
  metadata: {
    full_description: string;
    photo?: {
      url?: string;
      imgix_url?: string;
    };
  };
}

interface TeamSection {
  metadata?: {
    header?: string;
    people?: Person[];
  };
}

interface ValuesSection {
  metadata?: {
    header?: string;
    body_text?: string;
    images?: Array<{
      title?: string;
      metadata?: {
        image?: {
          imgix_url?: string;
          url?: string;
        };
      };
    }>;
  };
}

interface AboutPageProps {
  cosmic: CosmicData | null;
  valuesSection: ValuesSection | null;
  teamSection: TeamSection | null;
}

// Helper function to parse full_description
function parsePersonDetails(fullDescription: string) {
  const lines = fullDescription.split("\n");
  const details: {
    class?: string;
    concentration?: string;
    hometown?: string;
    role?: string;
  } = {};

  lines.forEach((line) => {
    if (line.startsWith("Class:")) {
      details.class = line.replace("Class:", "").trim();
    } else if (line.startsWith("Concentration:")) {
      details.concentration = line.replace("Concentration:", "").trim();
    } else if (line.startsWith("Home:")) {
      details.hometown = line.replace("Home:", "").trim();
    } else if (line.startsWith("Leadership Role:")) {
      details.role = line.replace("Leadership Role:", "").trim();
    }
  });

  return details;
}

export default function AboutPage({ cosmic, teamSection, valuesSection }: AboutPageProps) {
  // Fallback content if Cosmic data is not available
  const fallbackItems = [
    {
      id: "item-1",
      title: "Our Mission",
      content:
        "BRYTE's mission is to support the self-empowerment of refugee youth by providing academic tutoring and mentoring, as well as by fostering community among students who share experiences of resettlement in the United States.",
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

  const sections = cosmic?.metadata?.sections || [];
  
  // Filter out the "why bryte" section from accordion items since it will be displayed separately
  const accordionSections = sections.filter(
    (section) => section.slug !== "about-us-why-bryte"
  );

  let aboutItems =
    accordionSections.length > 0
      ? accordionSections.map((section, index) => ({
          id: section.id || `item-${index + 1}`,
          title: section.metadata?.header || "",
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: section.metadata?.body_text || "",
              }}
            />
          ),
        }))
      : fallbackItems;

  // Add team section as an accordion item if team members exist
  const teamMembers = teamSection?.metadata?.people || [];
  if (teamMembers.length > 0) {
    aboutItems = [
      ...aboutItems,
      {
        id: "our-team",
        title: teamSection?.metadata?.header || "Our Team",
        content: (
          <div className="team-accordion-content">
            <div className="team-grid">
              {teamMembers.map((person) => {
                const details = parsePersonDetails(person.metadata?.full_description || "");
                const photoUrl = person.metadata?.photo?.imgix_url || person.metadata?.photo?.url;
                
                return (
                  <div key={person.id} className="team-card">
                    <div className="team-card-header">
                      <h3 className="team-member-name">{person.title}</h3>
                      {details.role && (
                        <p className="team-member-role">{details.role}</p>
                      )}
                    </div>
                    
                    <div className="team-card-image-container">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={person.title}
                          className="team-member-photo"
                        />
                      ) : (
                        <div className="team-member-photo-placeholder" />
                      )}
                      <div className="team-card-starburst" />
                    </div>
                    
                    <div className="team-card-details">
                      {details.class && (
                        <p className="team-detail">Class: {details.class}</p>
                      )}
                      {details.concentration && (
                        <p className="team-detail">Concentration: {details.concentration}</p>
                      )}
                      {details.hometown && (
                        <p className="team-detail">Hometown: {details.hometown}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ),
      },
    ];
  }

  return (
    <>
      <Header />
      <Masthead
        showLargeTitle={true}
        showAtSymbol={false}
        topRowPillColorClass="bryte-pill-green"
        titleWords={["About us"]}
        decorativePills={[
          {
            colorClass: "bryte-pill-maroon",
            size: "medium",
            row: 0,
            position: "left",
          },
          {
            colorClass: "bryte-pill-orange",
            size: "short",
            row: 0,
            position: "right",
          },
        ]}
      />

      <AccordionComponent
        items={aboutItems}
      />

      {valuesSection?.metadata && (
        <Section
          title={valuesSection.metadata.header || "Why BRYTE?"}
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: valuesSection.metadata.body_text || "",
              }}
            />
          }
          image={
            valuesSection.metadata.images?.[0]?.metadata?.image
              ? {
                  src:
                    valuesSection.metadata.images[0].metadata.image.imgix_url ||
                    valuesSection.metadata.images[0].metadata.image.url ||
                    "",
                  alt:
                    valuesSection.metadata.images[0].title ||
                    valuesSection.metadata.header ||
                    "Our Values",
                }
              : undefined
          }
          imagePosition="right"
          sectionBackgroundColor="var(--darkgreen)"
          sectionTextColor="#fff"
        />
      )}
    </>
  );
}