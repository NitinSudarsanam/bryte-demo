import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import "./faqs.css";

const AccordionDemo = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">FAQS</h1>
        <Accordion.Root
            className="AccordionRoot"
            type="single"
            defaultValue="item-1"
            collapsible
        >
            <Accordion.Item className="AccordionItem" value="item-1">
            <AccordionTrigger>Why BRYTE?</AccordionTrigger>
            <AccordionContent>
                BRYTE’s unique model fosters long-term relationships and bi-directional
                learning. BRYTE capitalizes on the skills and position of university
                students to provide a tremendous service for an underserved population.
                Our work helps Providence’s refugee population develop cultural
                competency and confidence as well as vital language skills. Refugees
                gain the skills and confidence necessary to succeed in American society
                and at the same time, refugee families share their respective experiences
                and cultures with Brown students, opening their eyes to realities very
                different from their own. Additionally, BRYTE provides a unique lens
                onto the city of Providence and helps students build a connection to the
                city.
            </AccordionContent>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-2">
            <AccordionTrigger>Where and when do volunteers tutor?</AccordionTrigger>
            <AccordionContent>
                Volunteers tutor in the refugee families’ homes in Providence. Some
                tutors prefer to take the tutees to a local library, provided they have
                parental permission. For enrichment sessions, tutors have taken their
                tutees to movie theaters, ice skating rinks, local parks, and museums. A
                volunteer will often go down with a group of volunteers who are assigned
                to other students in the same family. Volunteers and students arrange
                tutoring sessions that accommodate each person’s schedule. Tutoring
                sessions are either twice a week for an hour and a half each, or once
                for three hours, and they can be scheduled during the week or on
                weekends.
            </AccordionContent>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-3">
            <AccordionTrigger>What is the commitment like?</AccordionTrigger>
            <AccordionContent>
                Volunteers must meet with their student for at least 3 hours per week,
                not including travel time to the student’s home. They must also commit
                to at least one year of tutoring to build a consistent and supportive
                relationship. Volunteers must also send in weekly Progress Reports to
                their BRYTE coordinator to reflect on progress made by both the tutor
                and the student and consider creative and effective ways to move
                forward. Volunteers typically go above and beyond these minimum time
                commitments to do more enrichment activities with the students and to
                develop a stronger relationship with their tutee.
            </AccordionContent>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-4">
            <AccordionTrigger>
                Do volunteers go through training before they tutor for the first time?
            </AccordionTrigger>
            <AccordionContent>
                Yes. All BRYTE volunteers are required to attend a full day of training
                before they are allowed to begin tutoring. During the training, new
                volunteers become familiar with the goals and history of BRYTE as well
                as the responsibilities of being a part of this organization. They also
                learn about the refugee population in Providence and how refugee
                resettlement works in the United States. The training reviews safety
                guidelines and specific considerations for in-home tutoring. In smaller
                groups, tutors receive training on how to plan tutoring and enrichment
                sessions, as well as how to teach literacy and math.
            </AccordionContent>
            </Accordion.Item>

            <Accordion.Item className="AccordionItem" value="item-5">
            <AccordionTrigger>
                I want to tutor for BRYTE. When can I start?
            </AccordionTrigger>
            <AccordionContent>
                We accept applications at the beginning of each semester. Email{" "}
                <a
                href="mailto:brown.refugee.tutoring@gmail.com"
                className="text-blue-600 underline"
                >
                brown.refugee.tutoring@gmail.com
                </a>{" "}
                for more information.
            </AccordionContent>
            </Accordion.Item>
        </Accordion.Root>
    </div>
);

const AccordionTrigger = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="AccordionHeader">
      <Accordion.Trigger
        className={classNames("AccordionTrigger", className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon className="AccordionChevron" aria-hidden />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);

const AccordionContent = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames("AccordionContent", className)}
      {...props}
      ref={forwardedRef}
    >
      <div className="AccordionContentText">{children}</div>
    </Accordion.Content>
  )
);

export default AccordionDemo;
