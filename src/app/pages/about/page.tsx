import { fetchCosmicObject } from "@/app/lib/cosmic";
import AboutPage from "./AboutPage";

export default async function Page() {
  // Fetch "about-us" page object from Cosmic using the correct bucket
  let cosmic;
  try {
    cosmic = await fetchCosmicObject({
      bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
      readKey: process.env.COSMIC_READ_KEY!,
      type: "pages",
      slug: "about-page",
      props: "slug,title,metadata,type",
      depth: 2,
    });
    console.log("Cosmic about data:", JSON.stringify(cosmic, null, 2));
  } catch (error) {
    console.error("Error fetching about:", error);
    // If the about object doesn't exist in Cosmic, use fallback data
    cosmic = null;
  }

  // Fetch "about-us-our-team" section from Cosmic
  let teamSection;
  try {
    teamSection = await fetchCosmicObject({
      bucketSlug: "basic-template-production",
      readKey: "38hX2h4NgRq5t6btJvbkjxJygVsfD9jN5eX9TG9sV8BYPEHw8f",
      type: "sections",
      slug: "about-us-our-team",
      props: "slug,title,metadata,type",
      depth: 1,
    });
    console.log("Cosmic team section data:", JSON.stringify(teamSection, null, 2));
  } catch (error) {
    console.error("Error fetching team section:", error);
    teamSection = null;
  }

  return <AboutPage cosmic={cosmic} valuesSection={null} teamSection={teamSection} />;
}

// "use client";
// import AccordionComponent from "@/app/components/accordion";
// import Section from "@/app/components/section/section";
// import Header from "@/app/components/header";
// import CosmicTemplate from "@/app/components/CosmicTemplate";

// export default function AboutPage() {
//   const aboutItems = [
//     {
//       id: "item-1",
//       title: "Our Mission",
//       content:
//         "BRYTE's mission is to support the self-empowerment of refugee youth by providing academic tutoring and mentoring, as well as by fostering community among students who share experiences of resettlement in the United States.",
//     },
//     {
//       id: "item-2",
//       title: "Our Values",
//       content: (
//         <>
//           <strong>Whole Child, Whole Families, Whole Care </strong>
//           <br />
//           We recognize that no child learns in a vacuum. Every child's
//           wellbeing, ability to learn, and life at home are deeply intertwined.
//           We also recognize that every child is different, with unique needs,
//           strengths, histories of trauma, and relationships to school. For these
//           reasons, we provide one-on-one tutoring and mentoring and commit to
//           meeting our youth where they are and as they are. Our goal is overall
//           wellness, rather than a sharp focus exclusively on academic outcomes.
//           <br />
//           <br />
//           <strong>Student Leadership</strong>
//           <br />
//           We are a group of undergraduate, medical, and public health students,
//           who are also advised by a board of high school-aged alumni of BRYTE.
//           We believe in the unique power, energy, and creativity of student
//           organizations and student movements. We believe student leadership
//           benefits everybody in our program, creating deep relationships that
//           transform both refugee youth and students in higher education.
//           <br />
//           <br />
//           <strong>Longitudinal Relationships</strong>
//           <br />
//           We recognize that every refugee child and refugee family has a unique
//           journey to adapting and thriving in a new environment. For this
//           reason, we work with both newly-arrived youth and youth who have lived
//           in the United States for some time. We do not adhere to a fixed policy
//           at which we "phase out" our youth but address each case on an
//           individualized basis. We form deep relationships with our students and
//           families that often last long beyond tutoring. As our students grow,
//           we create opportunities for them to exercise leadership and service in
//           their communities.
//           <br />
//           <br />
//           <strong>Self-Reflection and Accountability</strong>
//           <br />
//           We diligently document our work and create layers of accountability at
//           every step. Our work is supervised and closely advised by experts, and
//           we engage in formal didactic trainings alongside our
//           learning-by-doing. We are transparent about how we spend our resources
//           and regularly report our process and outcome measures to our
//           supporters. We evaluate our impact both quantitatively and
//           qualitatively and practice deep self-reflection, striving always to
//           improve our work.
//           <br />
//           <br />
//           <strong>Soul</strong>
//           <br />
//           We recognize that it is impossible to engage in this work without
//           being deeply moved by it. We are here to share ourselves with our
//           youth and to create the space for them to share themselves with us and
//           with each other. We embrace emotional honesty, joy, and above all,
//           love.
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Header />
//       <AccordionComponent title="About Bryte!" items={aboutItems} />
//       <Section
//         title="WHY BRYTE?"
//         content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//         image={{
//           src: "/path/to/your/image.jpg",
//           alt: "Children playing sports outdoors",
//         }}
//         imagePosition="right"
//         sectionBackgroundColor="var(--darkgreen)"
//         sectionTextColor="#fff"
//       ></Section>
//     </>
//   );
// }
