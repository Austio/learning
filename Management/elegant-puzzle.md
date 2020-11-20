## Chapter 2 - Organizations

Rules for sizing
 - Managers should support 6-8 engineers
     - gives time for coaching, coordinating, leading change, writing strategies
   - Tech Lead Managers - Fewer than 4, allows you to support design and implement
   - Coaches - More than 8/9 - Too busy to actually invest time in teams area of responsibility
 - Manager of Managers - Support 4-6 managers
   - gives time to align with stakeholders, invest in org, keep busy enough to not make work for team
 - On call wants 8 engineers
 - Small teams (fewer than 4) are not teams, they function indistinguisably from individuals
 - Keep inovation and maintenance together
  - teams should be 6-8 during steady state, can grow to 10 then split
  - never create empty teams
  - Never leave managers supporting more than 8

Teams are in 4 states
 - Falling Behind - Backlog growing.  Hire more people
 - Treading Water - Get critical work but not able to pay down debt or major projects.
 - Repaying Debt -
 - Innovating - Sustainably low, morale high, majority of work satisy new user needs

Top Down Global Optimization
 - Move scope between teams and preserving the teams.

## Chapter 3 - Tools

Lead Efficient Change with Systmes thinking, Metrics and Vision.  When steps of change are too wide, teams destablize and gaps open.  Good managers step in to act as glue to be PM, Recruiter, Sales, etc.

#### Thinking in Systems:

Changes (even big ones) are caused by events or series of small events that are linked and sometimes subtle.
 - Stock: Accumulation of changes over time
 - Flow: Inflow or Outflow
 - Information Link: The links between Flows and Stock to produce some outcome

Every Flow is a Rate, Every Stock is a Quantity.

Example: Hiring Rate to Produce New Features
 - Hiring Rate -> New Managers -> Training Rate -> Trained Managers -> Departure Rate
 - Trained Managers impact the Development Rate -> Features

Example: Feedback Loop from Deployments.  A sufficiently High Defect Rate or slow Recovery Rate can cause deployments to leave you further behind
 - Code Review Rate -> Pull Requests to Ready Commits
 - Deploy Rate -> Ready Commits to Deployed Commits
 - Defect Rate -> Deployed Commits to Incidents
 - Recovery Rate -> Incidents to Reverted Commits
 - Debug Rate -> Reverted Commits into new PRs

Product Management is mostly iterative around
 - Problem Discovery: Uncovering Possible problems to work on.
   - Detemine User Pain (UX, Surveys, Interviews)
   - User Purpose (motivation, better enable their goals)
   - Benchmark: Compare to competitors, are they weak, where and why
   - Cohorts: What is hiding behind your distributions, look for new kinds of users with surprising needs
   - Competitive Advantage / Moats: What areas are you exceptionally Strong in, ID opportunities
   - Compounding Leverage: What would enable people later based on investments today
 - Problem Selection: Which subset of uncovered do we work on
   - Surviving the Round/Next Round (money?)
   - Winning Round over Competitor
   - Different Time Frames: Optimizing for now, quarter, yearly, 5 year?
   - Industry Trends and ROI
   - Experiments to Learn
 - Solution Validation: Ensuring approach to solving problems is as cheap as possible
   - Launch Customer Letter: Write the letter you would after completing the feature, is this valuable and good?
   - Prior Art: How do others do this
   - Reference Users: Will someone try it once you make it
   - Prefer Experimentation over Analysis
   - Prefer the Fast Path and the Cheapest way to Validate
   - Justify Switching Costs: if someone uses you vs x, will it be worth it to them

#### Visions and Strategies
 - Agreeing with Strategy and Vision is the most efficient way to align at scale
   - When you can no longer partner with teams on their roadmaps, you will find yourself surprised by projects they work on.  You can't debate projects and approaches when you cannot attend the meeting.
   - You can't dive in to each instance (not enough time) and adding design review is good for after the fact or adjustment but not alignment with vision.
 - Strategies are grounded documents that explain tradeoffs and actions to address a specific challenge
 - Visions are aspirational documents that enable individuals who don't work closely to make decisions that fit together cleanly

|Strategy|Vision|
|---|---|---|
|Purpose|Approach a Specific Challenge|Gentle Aligning Pressure|
|Character|Practical|Aspirational|
|Time Frame|Variable|Long Term|
|Specificity|Accurate, Detailed|Illustrative, Directional|
|Quantity|As many as are useful|As Few as Possible|

Strategies: Harsh Trade-Offs necessary to overcome a particular challenge
 - Diagnosis: Describe the Challenge at Hand.  Factors and Contstraints through a thorough problem statement.  Good problem statements cause several good approaches.  Be honest about constraints that make challenges difficult
 - Policies: Apply to address the challenge.  Describe general approach and trade-offs between competing goals.
 - Actions: When you apply policy to Diagnosis.  You must commit to this as you write/publish steps.  When you read good, coherent actions you will think "this is uncomfortabled but i think it can work" vs bad ones "Ah, we got afraid of the consequences and we aren't really changing anything"

Vision: A future where trade-offs are no longer mutually exclusive
 - Aligns progress without requiring tight centralized Coordination
 - Write from a place far enough out that the error bars of uncertainty are indesputably broad, where you can focus on concepts and not particulars, visions should be detailed but the details are used to illustrate the dream vividly, not to prescriptively constrain possibilities.
 - Vision Statement: 1-2 sentance summarizing document, core speaking points, memorably evoke your vision effectively
 - Value Proposition: How does this help users/company.  What success will you enable them to achieve.
 - Capabilities: What will the product/platform/team need to deliver on this.
 - Solved Constraints: What limits you now but won't in the future
 - Future Constraints: What will come up? funding/hiring?
 - Reference Material: Plans, metrics, updates, reference
 - Narrative: Sythesize above details in a short (1 page) narrative that serves as easy to digest summary.

Test your vision, refresh it periodically, use present tense and write simply.

#### Metrics and Baselines
 - Bad goals are indistinguishable from numbers (our p50 build time will be below two seconds, finish 8 projects).  You know it is bad if you read it and aren't sure if it is ambitious or whether it matters.
 - Good Goals have 4 specific numbers: Target to Reach, Baseline for Today, Trend Current Velocity, Time Frame for bounds to change
 - Good test for a good goal is if someone who doesn't know much about the area can feel for the goal's general degree of difficulty and evaluate if it was successfully achieved

Baselines are where you are now, investments are where you are going to reach.


Example:
  “Core batch jobs should finish within three hours (p95) by the end of Q3. They currently take six hours (p95), and over the course of Q2 they got two hours slower.”

This is well structured but incomplete because you could reach tomorrow by doubling cluster, which is undesirable.

To avoid this, pair investment goals with baseline metrics, pair the above with
 - Efficiency of running jobs should not exceed current price of .05/GB
 - Core jobs should not increase alert load on teams operating or using pipeline

Set as few investment goals as possible, maybe 3 and these should be the focus of planning discussions.  Identify more baseline goals than investment goals.    Once identified
 - Explore: How can you get data into a format you can look at
 - Dive: Understand how costs drive the levers
 - Attribute: (cost, latency, dev velocity) uncover the team who are accountable for the metric
 - Contextualize: build context around the performance
 - Nudge: Dashboards are great at motivating teams to be better
 - Baseline/Review

For migrations:
 - embed into the most challenging one or two teams
 - each team who endorses a migration is making a bet on you

#### Reorgs
 - Can you write a crisp mission statement for each team?
 - Put teams that work together close together?
 - List areas of ownership, define clear interfaces?


#### Model, Document and Share
 - Model: Measure your team's health (surveys) and throughput (task sizing).  Then run kanban, dn't publicize or make a big deal out of it.  Use health and throughput to understand.
 - Document: After finding an effective approach, document the problem you set to solve, the learning process and how another team could adopt it.  Be detailed.
 - Share: Send it to another team to try.

Model, Document, Share: Adopt a great approach slowly
vs
Mandate: Top down, good-enough approach quickly when teams have bandwidth to adopt


#### Presenting
 - Start with conclusion (Bottom Line Up Front)

## CPT 4 Approaches

 - Environments that tolerate frequent exceptions are susceptible to bias and inefficient.  Consistency is king.
 - Orgs survive by adapting ot the dynamic circumstances they live in.  Staying stuck in old ways can lead to failure.

 - Solution to these divergent issues, "Work the policy, not the exceptions"

 If you find yourself writing constraints that don't constrain choice, it's useful to check if you are dancing around an uhstated goal.
 - policy is expensive, don't write it if they do little to constrain behavior
 - in non-constraining examples, write norms that provide nonbinding recommendations

Applying policy consistency is challenging because
 - Accepting reduced opportunity space: Good constraints make trade-offs that deliberately narrow opportunity space
 - Locally suboptimal: Satisfying global constraints leads to local inefficiency

At a sufficiently high rate of change, policy is indistinguishable from exception.
 - Batch changes to monthly or quarterly so that you have many examples and a lower rate of change

#### On NO

Our job is to create an environment for those around us to be their best, in fair surroundings.
 - NO is an expression of what is possible for the team you lead to do.

Expressing no effectively requires you to be able to say no and explain the constraints then articulate why the proposed path is either unattainable or undesirable.

Articulating Constraints is harder in two areas
 - Velocity: Why is this taking so long?
  - When people ask for more, provide a compelling explanation of how your team finished work "Finishes" is different than "does".  Half done work has no value.
  - To understand the slowdowns, you have to either do a sampling profile (check on what people are working on)
  - You can add capacity by moving resources to the team or creating new resources
  - Best outcome of a velocity discussion is to identify a reality based approach that will support your core constraint.  The second best outcome is for folds to agree that you're properly allocated against your constraints and shift conversation to prioritization
 - Prioritization: Why can't you work on this other project?
  - Break down your priorities into; all incoming tasks, guiding principles for how work is selected then share subsets of tasks you've selected based on those guiding principles
  - Ask "Does this seem like the right list of tasks" once you articulate guiding principles
  - When a stakeholder disagrees with your priorities, understand their requests, sit down with them to test their ask against your guiding principles and currently prioritized work.
   - if their requests are more important, shift focus, prefer to do this at the start of the next spring to prevent churn from shifting priorities immediately

#### Relationships

"With the right people, any process works, with the wrong people, no process works"

See ourselves as how we treat a member of our team who is not succeeding.  Your guide is not at the mirror but at the compassion.
 - Who do we promOte, who do we assign raises, Growth, PTO, working hours
 - Remember, we leave a broad wake and our actions have a profound impact on those around us

Strong Relationships > Any Problem
 - Almost every internal problem can be traced back to a missing or poor relationship.
 - Technical Disagreements are good for learning for everyone.
 - Spend more time with people that you have a bad relationship with, have dinner with them
 - If two engineers struggle tow ork together, help them build together

#### Your company, your team, yourself
 - Start thinking form company perspective, does the objective align with what we need
 - Then make decisions from team, push back on timelines that would force your team into a death march
 - Pay yourself, give what you can sustainably give then draw the line

#### Growth Plates
 - Manage between execution and ideas, when you have a lot of ideas execution is valued more

### How do engineering managers get stuck
 - Only Manage Down: Building something your team wants to build, which company/customers aren't interested in
 - Only Manage Up: Following your managers wishes to a point where the team evaporates
 - Never Manage Up: Your team's success and recognition depend on your relationship with management chain, don't let excellent work go unnoticed, share it up
 - Optimize Locally: Don't pick technology the company can't support or build products that puts you in competition with another team
 - Assume hiring never solves problems: Firefighting is great, but eventually you will hire or burn out
 - Don't spend time building relationships: You need a supportive social network within the company
 - Define Roles too Narrowly: You should fill all gaps and do things you really don't want to do
 - Forget that their manager is a human:

More Experienced Managers:
 - Do what worked at previous company
 - Spend too much time building relationships (smaller companies are execution focused)
 - Assume hiring can solve every problem
 - Abscond rather than delegate: Delegation is important, however it's easy to go too far and ignore critical responsibilities you ask others to take on
 - Become disconnected from ground truth: ground decisions in real reality

Managers of any level:
 - Mistake team size for impact: Larger team does not mean better job
 - Mistake title for impact: titles don't translate
 - Confuse authority with truth: Authority lets you get away with weak arguments and poor justifications, it's an expensive way to work and eventually people will turn off their minds and simply follow orders
 - Don't trust the team enough to delegate: You can't scale your impact if you don't give enough room to do things, many organizations become bottlenecked on approvals which is a sure proxy for lack of trust
 - Let others manage their time:
 - Only see the problems: Don't forget to celebrate the good stuff

#### Partner with your manager
 - You need them to know a few things about you
 - You need to know a few things about them
 - You should occasionally update the things you know about each other

Things the manager should know
 - What problems you are trying to solve (who)
 - That you are making progress (Specifically, that you are not stuck)
 - What you prefer to work on (So they can staff properly)
 - How busy you are (So that they know if you can take opportunity that comes up)
 - Your professional goals and growth areas, where you are between bored and challenge
 - How you believe you are being measured

How to do this
 - Maintain a document with the information
 - Sprinkle this information in one on ones
 - Write a self reflection quarterly which covers each of those aspects, share with manager

Other good things to know
 - What are their current priorities, key problems and initiatives
 - How stressed, busy they are, do they feel like they have time to grow in their role
 - Is there anything you can do to help
 - What are they trying to improve on themselves

#### Finding managerial scope
- Manager - Manage a team
- Director - Manage a team of managers
- VP - Manage an organization

Don't worry so much about titles, pursue scope where you take responsibility for the success of increasingly important complex facets of the organization and company.

There is a lot less competition for hard work

#### Setting organizational direction

- Find directions: Cast a wide net for what other companies did well and how they did it.  Meet with peer companies and ask them what they're focused on.

#### Close out solve or delegate

When you move from ic to lead to manager to "manager of managers" it is unsettling because you lose access to what used to make you happy and haven't found new sources of self-worth.  Also your skills and habits stop working will.  Now rolling up sleeves and working is probably the wrong answer because you are inefficient and a blocker.

For each request you have to choose a path
 - Close Out: Make a decision and communicate so that the task never comes back to you, fix it as quickly and permanently as possible
 - Solve: Design a solution such that you won't need to spend time on this problem again in the next 6 months
 - Delegate: Redirect to ask someone else to handle

## Culture

 - The basis: an inclusive organization is one in which individuals have access to opportunity and membership

Measuring:
  - Retention: who is staying and going
  - How often do folks get picked to lead a project
  - Distribution: Are there enough of people like others in leadership positions
  - Time at level: how long do people stay at one level as opposed to another

Membership:
 - Recurring Weekly Events: Allow Coworkers to interact socially during work hours.
 - Employee Resource Groups: Folks with similar background to build community
 - Team Offsites: Coffee Chats to get people interacting when they dont' need something from each other

With the above things, measure Retention, Amount of people asking others to join, Attendance and quality of completion rates of chats

Project Lead Selection: To increase the number of people that will interact with a project
 - Define Scope and Goals in a Short document.  Specifics:
   - Time Commitment, Requirements to Apply, Selection Criteria
 - Announce the availability to apply
 - Nudge folks to apply, sponsor them by finding an advisor

Managing Freedom:
 - Positive: can do what you want
 - Negative: restricts you

Tom Demarco, every time you start a new project, do something new.

Hero's
 - Kill the hero programmer or kill the environment that enables the hero
 - Projects fail all the time, acknowledge misteps that exacerbate mistakes and cut losses on bad decisions before burning ourselves out.  Then we can learn from our mistakes and improve.

## Reference Articles
[Effectively Using AWS Reserved Instances](Effectively Using AWS Reserved Instances)

## Chapter 6 - Careers

Roles over Rocket Ships

Build a map of career
 - Each time meaningful transition in how you work, mark that down.
 - Think of era's, how did the values and expectations change, did operational toil become considered critical work, what skills did you depend on most, which fell out of use?

Both stable eras and transitions are great opportunities for growing yourself.

### Interviews
 - Be kind to the candidate
 - Ensure that all interviewers agree on the roles' requirements
 - Understand the signal your interview is checking for
 - Come to your interview prepared
 - Deliberately express interest in the candidate

## Chapter 7 - Appendix

Teams and organizations have limited appetite for new process.  Roll one change at a time.where

Successful Sprint
 - Teams know what they should be working on
 - Teams know why their work is valuable
 - Teams can determine if their work is incomplete
 - Teams know how to figure out what to work on next
 - Stakeholders can learn what a team is working on
 - Stakeholders can learn what the team plans to work on next
 - Stakeholders know how to influence teams plans

Middle management
 - moves from receiving asks from stakeholders to deeply understanding what is motivating those asks
 - invest in learning what other folks are working on to continuously validate your team's efforts are valuable
 - prevent misalignment (others working on same task, relying on the wrong tools)

## Management Book Recommendatiosn

      |Thinking in Systems: A Primer|by Donella H. Meadows|For me, systems thinking has been the most effective universal tool for reasoning through complex problems, and this book is a readable, powerful introduction.|
      |Don’t Think of an Elephant! Know Your Values and Frame the Debate|by George Lakoff|While written from a political perspective that some might find challenging, this book completely changed how I think about presenting ideas. You may be tempted to instead read Lakoff’s more academic writing, but I’d recommend reading this first as it’s much briefer and more readable.|
      |Peopleware: Productive Projects and Teams|by Timothy Lister and Tom DeMarco|The book that has given generations of developers permission to speak on the challenges of space planning and open offices. Particularly powerful in grounding the discussion in data.|
      |Slack: Getting Past Burnout, Busywork, and the Myth of Total Efficiency|by Tom DeMarco|Documents a compelling case for middle managers as the critical layer where organizational memory rests and learning occurs. A meditation on the gap between efficiency and effectiveness.|
      |The Mythical Man-Month|by Frederick Brooks|The first professional book I ever read, this one opened my eyes to the wealth of software engineering literature waiting out there.|
      |Good Strategy/Bad Strategy The Difference and Why it Matters|by Richard Rumelt|This book gave me permission to acknowledge that many strategies I’ve seen professionally are not very good. Rumelt also offers a structured approach to writing good strategies.|
      |The Goal: A Process of Ongoing Improvement|by Eliyahu M. Goldratt|Explores how constraint theory can be used to optimize process.|
      |The Five Dysfunctions of a Team|by Patrick Lencioni|---|
      |The Three Signs of a Miserable Job|by Patrick Lencioni|Another Lencioni book, this one explaining a three-point model for what makes jobs rewarding.|
      |Finite and Infinite Games|by James P. Carse|Success in most life situations is about letting everyone continue to play, not about zero-sum outcomes. This seems pretty obvious, but for me it helped reset my sense of why I work.|
      |INSPIRED: How to Create Tech Products Customers Love|by Marty Cagan|A thoughtful approach to product management.|
      |The Innovator’s Dilemma: When New Technologies Cause Great Firms to Fail|by Clayton M. Christensen|A look at how being hyper-rational in the short run has led many great companies to failure. These days, I think about this constantly when doing strategic planning.|
      |The E-Myth Revisited: Why Most Small Businesses Don’t Work and What to Do About It|by Michael E. Gerber|The idea that leadership is usually working “on” the business, not “in” the business. Work in the business to learn how it works, but then document the system and hand it off.|
      |Fierce Conversations: Achieving Success at Work and in Life, One Conversation at a Time|by Susan Scott|How to say what you need to say. This is particularly powerful in giving structure to get past conflict aversion.|
      |Becoming a Technical Leader: An Organic Problem-Solving Approach|by Gerald M. Weinberg|Permission to be a leader that builds on your strengths, not whatever model that folks think you should fit into.|
      |Designing with the Mind in Mind|by Jeff Johnson|An introduction to usability and design, grounding both in how the brain works.|
      |The Leadership Pipeline: How to Build the Leadership Powered Company|by Ram Charan, Steve Drotter, and Jim Noel|This book opened my eyes to just how thoughtful many companies are in intentionally growing new leadership.|
      |The Manager’s Path: A Guide for Tech Leaders Navigating Growth and Change|Camille Fournier|
      |High Output Management|Andy S. Grove|
      |The First 90 Days: Proven Strategies for Getting Up to Speed Faster and Smarter, Updated and Expanded|Michael D. Watkins|
      |The Effective Executive: The Definitive Guide to Getting the Right Things Done|Peter F. Drucker|
      |Don’t Make Me Think: A Common Sense Approach to Web Usability|Steve Krug|
      |The Deadline: A Novel About Project Management|Tom DeMarco|
      |The Psychology of Computer Programming|by Gerald M. Weinberg|
      |Adrenaline Junkies and Template Zombies: Understanding Patterns of Project Behavior|Tom Demarco, Peter Hruschka, Tim Lister, Steve McMenamin, Suzanne Robertson, and James Robertson|
      |The Secrets of Consulting: A Guide to Giving and Getting Advice Successfully| by Gerald M. Weinberg|
      |Death by Meeting|Patrick Lencioni|
      |The Advantage: Why Organizational Health Trumps Everything Else in Business| by Patrick Lencioni|
      |Rise: 3 Practical Steps for Advancing Your Career, Standing Out as a Leader, and Liking Your Life| by Patty Azzarello|
      |The Innovator’s Solution: Creating and Sustaining Successful Growth| by Clayton M. Christensen and Michael E. Raynor|
      |The Phoenix Project: A Novel about IT, DevOps, and Helping Your Business Win| by Gene Kim, Kevin Behr, and George Spafford|
      |Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations| by Nicole Forsgren PhD, Jez Humble, and Gene Kim|

      |“Dynamo: Amazon’s Highly Available Key-Value Store”|If you read only the abstract, you’d be forgiven for not being overly excited about the Dynamo paper. This paper presents the design and implementation of Dynamo, a highly available key-value storage system that some of Amazon’s core services use to provide an always-on experience. To achieve this level of availability, Dynamo sacrifices consistency under certain failure scenarios. It makes extensive use of object versioning and application-assisted conflict resolution in a manner that provides a novel interface for developers to use.  That said, this is in some senses “the” classic modern systems paper. It has happened more than once that an engineer I’ve met has only read a single systems paper in their career, and that paper was the Dynamo paper. This paper is a phenomenal introduction to eventual consistency, coordinating state across distributed storage, reconciling data as it diverges across replicas, and much more.|
      |Hints for Computer System Design”|Butler Lampson is winner of the ACM Turing Award (among other awards), and worked at the Xerox PARC. This paper concisely summarizes many of his ideas around systems design, and is a great read.  In his words: Studying the design and implementation of a number of computers has led to some general hints for system design. They are described here and illustrated by many examples, ranging from hardware such as the Alto and the Dorado to application programs such as Bravo and Star.. This paper itself acknowledges that it doesn’t aim to break any new ground, but it’s a phenomenal overview.|
      |Big Ball of Mud”|A reaction against exuberant publications about grandiose design patterns, this paper labels the most frequent architectural pattern as the Big Ball of Mud, and explores why elegant initial designs rarely remain intact as a system goes from concept to solution.  From the abstract: While much attention has been focused on high-level software architectural patterns, what is, in effect, the de-facto standard software architecture is seldom discussed. This paper examines this most frequently deployed of software architectures: the BIG BALL OF MUD. A BIG BALL OF MUD is a casually, even haphazardly, structured system. Its organization, if one can call it that, is dictated more by expediency than design. Yet, its enduring popularity cannot merely be indicative of a general disregard for architecture.. Although humor certainly infuses this paper, it’s also correct that software design is remarkably poor. Very few systems have a design phase and few of those resemble the initial design (and documentation is rarely updated to reflect later decisions), making this an important topic for consideration.|
      |The Google File System”|From the abstract: The file system has successfully met our storage needs. It is widely deployed within Google as the storage platform for the generation and processing of data used by our service as well as research and development efforts that require large data sets. The largest cluster to date provides hundreds of terabytes of storage across thousands of disks on over a thousand machines, and it is concurrently accessed by hundreds of clients. In this paper, we present file system interface extensions designed to support distributed applications, discuss many aspects of our design, and report measurements from both micro-benchmarks and real-world use. Google has done something fairly remarkable in defining the technical themes in Silicon Valley and, at least debatably, across the entire technology industry. The company has been doing so for more than the last decade, and was only recently joined, to a lesser extent, by Facebook and Twitter as they reached significant scale. Google has defined these themes largely through noteworthy technical papers. The Google File System (GFS) paper is one of the early entries in that strategy, and is also remarkable as the paper that largely inspired the Hadoop File System (HFS).|

      |On Designing and Deploying Internet-Scale Services”|We don’t always remember to consider Microsoft as one of the largest internet technology players—although, increasingly, Azure is making that comparison obvious and immediate—and it certainly wasn’t a name that necessarily came to mind in 2007. This excellent paper from James Hamilton, which explores tips on building operable systems at extremely large scale, makes it clear that not considering Microsoft as a large internet player was a lapse in our collective judgment.  From the abstract: The system-to-administrator ratio is commonly used as a rough metric to understand administrative costs in high-scale services. With smaller, less automated services this ratio can be as low as 2:1, whereas on industry leading, highly automated services, we’ve seen ratios as high as 2,500:1. Within Microsoft services, Autopilot [1] is often cited as the magic behind the success of the Windows Live Search team in achieving high system-to-administrator ratios. While auto-administration is important, the most important factor is actually the service itself. Is the service efficient to automate? Is it what we refer to more generally as operations-friendly? Services that are operations-friendly require little human intervention, and both detect and recover from all but the most obscure failures without administrative intervention. This paper summarizes the best practices accumulated over many years in scaling some of the largest services at MSN and Windows Live.. This is a true checklist of how to design and evaluate large-scale systems (almost in the way that The Twelve-Factor App wants to serve as a checklist for operable applications).|

      |CAP Twelve Years Later: How the ‘Rules’ Have Changed”|Eric Brewer posited the CAP theorem in the early aughts, and 12 years later he wrote this excellent overview and review of CAP (which argues that distributed systems have to pick between either availability or consistency during partitions), Here’s the rationale for the paper, in Brewer’s words:In the decade since its introduction, designers and researchers have used (and sometimes abused) the CAP theorem as a reason to explore a wide variety of novel distributed systems. The NoSQL movement also has applied it as an argument against traditional databases. . CAP is interesting because there is not a “seminal CAP paper,” but this article serves well in such a paper’s stead. These ideas are expanded on in the “Harvest and Yield” paper.|

      |“Harvest, Yield, and Scalable Tolerant Systems”|This paper builds on the concepts from CAP Twelve Years Later, introducing the concepts of harvest and yield to add more nuance to the discussion about AP versus CP. The cost of reconciling consistency and state management with high availability is highly magnified by the unprecedented scale and robustness requirements of today’s internet applications. We propose two strategies for improving overall availability using simple mechanisms that scale over large applications whose output behavior tolerates graceful degradation. We characterize this degradation in terms of harvest and yield, and map it directly onto engineering mechanisms that enhance availability by improving fault isolation, and in some cases also simplify programming. By collecting examples of related techniques in the literature and illustrating the surprising range of applications that can benefit from these approaches, we hope to motivate a broader research program in this area.. The harvest and yield concepts are particularly interesting because they are both self-evident and very rarely explicitly used; instead, distributed systems continue to fail in mostly undefined ways. Hopefully, as we keep rereading this paper, we’ll also start to incorporate its design concepts into the systems we subsequently build!|

      |“MapReduce: Simplified Data Processing on Large Clusters”|The MapReduce paper is an excellent example of an idea that has been so successful that it now seems self-evident. The idea of applying the concepts of functional programming at scale became a clarion call, provoking a shift from data warehousing to a new paradigm for data analysis: MapReduce is a programming model and an associated implementation for processing and generating large data sets. Users specify a map function that processes a key/value pair to generate a set of intermediate key/value pairs, and a reduce function that merges all intermediate values associated with the same intermediate key. Many real-world tasks are expressible in this model, as shown in the paper.. Much like the Google File System paper was an inspiration for the Hadoop File System, this paper was itself a major inspiration for Hadoop.|

      |“Dapper, a Large-Scale Distributed Systems Tracing Infrastructure”|The Dapper paper introduces a performant approach to tracing requests across many services, which has become increasingly relevant as more companies refactor core monolithic applications into dozens or hundreds of micro-services.  From the abstract: Here we introduce the design of Dapper, Google’s production distributed systems tracing infrastructure, and describe how our design goals of low overhead, application-level transparency, and ubiquitous deployment on a very large-scale system were met. Dapper shares conceptual similarities with other tracing systems, particularly Magpie and X-Trace, but certain design choices were made that have been key to its success in our environment, such as the use of sampling and restricting the instrumentation to a rather small number of common libraries.. The ideas from Dapper have since made their way into open source, especially in Zipkin and OpenTracing.>|

      |“Kafka: a Distributed Messaging System for Log Processing”|Apache Kafka<spa has become a core piece of infrastructure for many internet companies. Its versatility lends it to many roles, serving as the ingress point to “data land” for some and as a durable queue for others. And that’s just scratching the surface.  Kafka is not only a useful addition to your tool kit, it’s also a beautifully designed system: Log processing has become a critical component of the data pipeline for consumer internet companies. We introduce Kafka, a distributed messaging system that we developed for collecting and delivering high volumes of log data with low latency. Our system incorporates ideas from existing log aggregators and messaging systems, and is suitable for both offline and online message consumption. We made quite a few unconventional yet practical design choices in Kafka to make our system efficient and scalable. Our experimental results show that Kafka has superior performance when compared to two popular messaging systems. We have been using Kafka in production for some time and it is processing hundreds of gigabytes of new data each day.. In particular, Kafka’s partitions do a phenomenal job of forcing application designers to make explicit decisions about trading off performance for predictable message ordering.|

      |“Wormhole: Reliable Pub-Sub to Support Geo-Replicated Internet Services”|In many ways similar to Kafka, Facebook’s Wormhole is another highly scalable approach to messaging: Wormhole is a publish-subscribe (pub-sub) system developed for use within Facebook’s geographically replicated datacenters. It is used to reliably replicate changes among several Facebook services including TAO, Graph Search, and Memcache. This paper describes the design and implementation of Wormhole as well as the operational challenges of scaling the system to support the multiple data storage systems deployed at Facebook. Our production deployment of Wormhole transfers over 35 GBytes/sec in steady state (50 millions messages/sec or 5 trillion messages/day) across all deployments with bursts up to 200 GBytes/sec during failure recovery. We demonstrate that Wormhole publishes updates with low latency to subscribers that can fail or consume updates at varying rates, without compromising efficiency.. In particular, note the approach to supporting lagging consumers without sacrificing overall system throughput.|

      |“Borg, Omega, and Kubernetes”|While the individual papers for each of Google’s orchestration systems (Borg, Omega, and Kubernetes) are worth reading in their own right, this article is an excellent overview of the three: Though widespread interest in software containers is a relatively recent phenomenon, at Google we have been managing Linux containers at scale for more than ten years and built three different container-management systems in that time. Each system was heavily influenced by its predecessors, even though they were developed for different reasons. This article describes the lessons we’ve learned from developing and operating them.. Fortunately, not all orchestration happens under Google’s aegis, and Apache Mesos’s alternative two-layer scheduling architecture is a fascinating read as well.|

      |“Large-Scale Cluster Management at Google with Borg”|Borg has orchestrated much of Google’s infrastructure for quite some time (significantly predating Omega, although, fascinatingly, the Omega paper predates the Borg paper by two years): Google’s Borg system is a cluster manager that runs hundreds of thousands of jobs, from many thousands of different applications, across a number of clusters each with up to tens of thousands of machines.. This paper takes a look at Borg’s centralized scheduling model, which was both effective and efficient, although it became increasingly challenging to modify and scale over time. Borg inspired both Omega and Kubernetes within Google (the former to optimistically replace it, and the latter to seemingly commercialize the designers’ learnings, or at least to prevent Mesos from capturing too much mind share).|

      |“Omega: Flexible, Scalable Schedulers for Large Compute Clusters”|Omega is, among many other things, an excellent example of the second-system effect, in which an attempt to replace a complex existing system with something far more elegant ends up being more challenging than anticipated.  In particular, Omega is a reaction against the realities of extending the aging Borg system: Increasing scale and the need for rapid response to changing requirements are hard to meet with current monolithic cluster scheduler architectures. This restricts the rate at which new features can be deployed, decreases efficiency and utilization, and will eventually limit cluster growth. We present a novel approach to address these needs using parallelism, shared state, and lock-free optimistic concurrency control.. Perhaps it’s also an example of “worse is better” once again taking the day.|

      |“Mesos: A Platform for Fine-Grained Resource Sharing in the Data Center”|This paper describes the design of Apache Mesos, in particular its distinctive two-level scheduler: We present Mesos, a platform for sharing commodity clusters between multiple diverse cluster computing frameworks, such as Hadoop and MPI. Sharing improves cluster utilization and avoids per-framework data replication. Mesos shares resources in a fine-grained manner, allowing frameworks to achieve data locality by taking turns reading data stored on each machine. To support the sophisticated schedulers of today’s frameworks, Mesos introduces a distributed two-level scheduling mechanism called resource offers. Mesos decides how many resources to offer each framework, while frameworks decide which resources to accept and which computations to run on them. Our results show that Mesos can achieve near-optimal data locality when sharing the cluster among diverse frameworks, can scale to 50,000 (emulated) nodes, and is resilient to failures.. Used heavily by Twitter and Apple, Mesos was for some time the only open-source general scheduler with significant adoption. It’s now in a fascinating competition for mind share with Kubernetes.|

      |“Design Patterns for Container-Based Distributed Systems”|The move to container-based deployment and orchestration has introduced a whole new set of vocabulary, including “sidecars” and “adapters.” This paper provides a survey of the patterns that have evolved over the past decade, as microservices and containers have become increasingly prominent infrastructure components: In the late 1980s and early 1990s, object-oriented programming revolutionized software development, popularizing the approach of building of applications as collections of modular components. Today we are seeing a similar revolution in distributed system development, with the increasing popularity of microservice architectures built from containerized software components. Containers are particularly well-suited as the fundamental “object” in distributed systems by virtue of the walls they erect at the container boundary. As this architectural style matures, we are seeing the emergence of design patterns, much as we did for object-oriented programs, and for the same reason—thinking in terms of objects (or containers) abstracts away the low-level details of code, eventually revealing higher-level patterns that are common to a variety of applications and algorithms.. The term “sidecar” in particular, likely originated in this blog post from Netflix, which is a worthy read in its own right.|

      |“Raft: In Search of an Understandable Consensus Algorithm”|We often see the second-system effect when a second system becomes bloated and complex relative to a simple initial system. However, the roles are reversed in the case of Paxos and Raft. Whereas Paxos is often considered beyond human comprehension, Raft is a fairly easy read: Raft is a consensus algorithm for managing a replicated log. It produces a result equivalent to (multi-)Paxos, and it is as efficient as Paxos, but its structure is different from Paxos; this makes Raft more understandable than Paxos and also provides a better foundation for building practical systems. In order to enhance understandability, Raft separates the key elements of consensus, such as leader election, log replication, and safety, and it enforces a stronger degree of coherency to reduce the number of states that must be considered. Results from a user study demonstrate that Raft is easier for students to learn than Paxos. Raft also includes a new mechanism for changing the cluster membership, which uses overlapping majorities to guarantee safety.. Raft is used by etcd and influxDB among many others.|

      |“Paxos Made Simple”|One of Leslie Lamport’s numerous influential papers, “Paxos Made Simple” is a gem, both in explaining the notoriously complex Paxos algorithm and because, even at its simplest, Paxos isn’t really that simple: The Paxos algorithm for implementing a fault-tolerant distributed system has been regarded as difficult to understand, perhaps because the original presentation was Greek to many readers. In fact, it is among the simplest and most obvious of distributed algorithms. At its heart is a consensus algorithm—the “synod” algorithm. The next section shows that this consensus algorithm follows almost unavoidably from the properties we want it to satisfy. The last section explains the complete Paxos algorithm, which is obtained by the straightforward application of consensus to the state machine approach for building a distributed system—an approach that should be well-known, since it is the subject of what is probably the most often-cited article on the theory of distributed systems.. Paxos itself remains a deeply innovative concept, and is the algorithm behind Google’s Chubby and Apache Zookeeper, among many others.|

      |SWIM: Scalable Weakly-Consistent Infection-Style Process Group Membership Protocol”|The majority of consensus algorithms focus on being consistent during partition, but SWIM goes the other direction and focuses on availability: Several distributed peer-to-peer applications require weakly-consistent knowledge of process group membership information at all participating processes. SWIM is a generic software module that offers this service for large-scale process groups. The SWIM effort is motivated by the unscalability of traditional heart-beating protocols, which either impose network loads that grow quadratically with group size, or compromise response times or false positive frequency w.r.t. detecting process crashes. This paper reports on the design, implementation, and performance of the SWIM sub-system on a large cluster of commodity PCs.. SWIM is used in HashiCorp’s software, as well as Uber’s Ringpop.|

      |“The Byzantine Generals Problem”|Another classic Leslie Lamport paper on consensus, the Byzantine Generals Problem explores how to deal with distributed actors that intentionally or accidentally submit incorrect messages: Reliable computer systems must handle malfunctioning components that give conflicting information to different parts of the system. This situation can be expressed abstractly in terms of a group of generals of the Byzantine army camped with their troops around an enemy city. Communicating only by messenger, the generals must agree upon a common battle plan. However, one or more of them may be traitors who will try to confuse the others. The problem is to find an algorithm to ensure that the loyal generals will reach agreement. It is shown that, using only oral messages, this problem is solvable if and only if more than two-thirds of the generals are loyal; so a single traitor can confound two loyal generals. With unforgeable written messages, the problem is solvable for any number of generals and possible traitors. Applications of the solutions to reliable computer systems are then discussed.. The paper is mostly focused on the formal proof, a bit of a theme from Lamport, who developed TLA+ to make formal proving easier, but it’s also a useful reminder that we still tend to assume our components will behave reliably and honestly, and perhaps we shouldn’t!|

      |“Out of the Tar Pit”|“Out of the Tar Pit” bemoans unnecessary complexity in software, and proposes that functional programming and better data modeling can help us reduce accidental complexity. (The authors argue that most unnecessary complexity comes from state.). From the abstract: Complexity is the single major difficulty in the successful development of large-scale software systems. Following Brooks we distinguish accidental from essential difficulty, but disagree with his premise that most complexity remaining in contemporary systems is essential. We identify common causes of complexity and discuss general approaches which can be taken to eliminate them where they are accidental in nature. To make things more concrete we then give an outline for a potential complexity-minimizing approach based on functional programming and Codd’s relational model of data.. The paper’s certainly a good read, although reading it a decade later, it’s fascinating to see that neither of those approaches have particularly taken off. Instead the closest “universal” approach to reducing complexity seems to be the move to numerous mostly stateless services. This is perhaps more a reduction of local complexity, at the expense of larger systemic complexity, whose maintenance is then delegated to more specialized systems engineers.  (This is yet another paper that makes me wish TLA+<span class="footnotenumbers"> felt natural enough to be a commonly adopted tool.)|

      |“The Chubby Lock Service for Loosely-Coupled Distributed Systems”|Distributed systems are hard enough without having to frequently reimplement Paxos or Raft. The model proposed by Chubby is to implement consensus once in a shared service, which will allow systems built upon it to share in the resilience of distribution by following greatly simplified patterns.  From the abstract: We describe our experiences with the Chubby lock service, which is intended to provide coarse-grained locking as well as reliable (though low-volume) storage for a loosely-coupled distributed system. Chubby provides an interface much like a distributed file system with advisory locks, but the design emphasis is on availability and reliability, as opposed to high performance. Many instances of the service have been used for over a year, with several of them each handling a few tens of thousands of clients concurrently. The paper describes the initial design and expected use, compares it with actual use, and explains how the design had to be modified to accommodate the differences.. In the open source world, the way Zookeeper is used in projects like Kafka and Mesos has the same role as Chubby.|

      |“Bigtable: A Distributed Storage System for Structured Data”|One of Google’s preeminent papers and technologies is Bigtable, which was an early (early in the internet era, anyway) NoSQL data store, operating at extremely high scale and built on top of Chubby. Bigtable is a distributed storage system for managing structured data that is designed to scale to a very large size: petabytes of data across thousands of commodity servers. Many projects at Google store data in Bigtable, including web indexing, Google Earth, and Google Finance. These applications place very different demands on Bigtable, both in terms of data size (from URLs to web pages to satellite imagery) and latency requirements (from backend bulk processing to real-time data serving). Despite these varied demands, Bigtable has successfully provided a flexible, high-performance solution for all of these Google products. In this paper we describe the simple data model provided by Bigtable, which gives clients dynamic control over data layout and format, and we describe the design and implementation of Bigtable.. From the SSTable design to the bloom filters, Cassandra inherits significantly from the Bigtable paper, and is probably rightfully considered a merging of the Dynamo and Bigtable papers.|

      |“Spanner: Google’s Globally-Distributed Database”|Many early NoSQL storage systems traded eventual consistency for increased resiliency, but building on top of eventually consistent systems can be harrowing. Spanner represents an approach from Google to offering both strong consistency and distributed reliability, based in part on a novel approach to managing time. Spanner is Google’s scalable, multi-version, globally distributed, and synchronously-replicated database. It is the first system to distribute data at global scale and support externally-consistent distributed transactions. This paper describes how Spanner is structured, its feature set, the rationale underlying various design decisions, and a novel time API that exposes clock uncertainty. This API and its implementation are critical to supporting external consistency and a variety of powerful features: nonblocking reads in the past, lock-free read-only transactions, and atomic schema changes, across all of Spanner.. We haven’t seen any open source Spanner equivalents yet, but I imagine we’ll start seeing them soon.|

      |“Security Keys: Practical Cryptographic Second Factors for the Modern Web”|Security keys like the YubiKey have emerged as the most secure second authentication factor, and this paper out of Google explains the motivations that led to their creation, as well as the design that makes them work.  From the abstract: Security Keys are second-factor devices that protect users against phishing and man-in-the-middle attacks. Users carry a single device and can self-register it with any online service that supports the protocol. The devices are simple to implement and deploy, simple to use, privacy preserving, and secure against strong attackers. We have shipped support for Security Keys in the Chrome web browser and in Google’s online services. We show that Security Keys lead to both an increased level of security and user satisfaction by analyzing a two-year deployment which began within Google and has extended to our consumer-facing web applications. The Security Key design has been standardized by the FIDO Alliance, an organization with more than 250 member companies spanning the industry. Currently, Security Keys have been deployed by Google, Dropbox, and GitHub.. These keys are also remarkably cheap! Order a few and start securing your life in a day or two.|

      |“BeyondCorp: Design to Deployment at Google”|Building on the original BeyondCorp paper, which was published in 2014, this paper is slightly more detailed and benefits from two more years of migration-fueled wisdom. That said, the big ideas have remained fairly consistent, and there is not much new relative to the BeyondCorp paper itself. If you haven’t read that fantastic paper, this is an equally good starting point: The goal of Google’s BeyondCorp initiative is to improve our security with regard to how employees and devices access internal applications. Unlike the conventional perimeter security model, BeyondCorp doesn’t gate access to services and tools based on a user’s physical location or the originating network; instead, access policies are based on information about a device, its state, and its associated user. BeyondCorp considers both internal networks and external networks to be completely untrusted, and gates access to applications by dynamically asserting and enforcing levels, or tiers, of access.. As is often the case when I read Google papers, my biggest takeaway here is to wonder when we’ll start to see reusable, pluggable open source versions of the techniques described within.|

      |“Availability in Globally Distributed Storage Systems”|This paper explores how to think about availability in replicated distributed systems, and is a useful starting point for those of us who are trying to determine the correct way to measure uptime for our storage layer or for any other sufficiently complex system.  From the abstract: We characterize the availability properties of cloud storage systems based on an extensive one-year study of Google’s main storage infrastructure and present statistical models that enable further insight into the impact of multiple design choices, such as data placement and replication strategies. With these models we compare data availability under a variety of system parameters given the real patterns of failures observed in our fleet.. Particularly interesting is the focus on correlated failures, building on the premise that users of distributed systems only experience the failure when multiple components have overlapping failures. Another expected but reassuring observation is that at Google’s scale (and with resources distributed across racks and regions), most failure comes from tuning and system design, not from the underlying hardware.  I was also surprised by how simple their definition of availability was in this case: A storage node becomes unavailable when it fails to respond positively to periodic health checking pings sent by our monitoring system. The node remains unavailable until it regains responsiveness or the storage system reconstructs the data from other surviving nodes.. Often, discussions of availability become arbitrarily complex (“It should really be that response rates are over X, but with correct results and within our latency SLO!”), and it’s reassuring to see the simplest definitions are still usable.|

      |“Still All on One Server: Perforce at Scale”|As a company grows, code hosting performance becomes one of the critical factors in overall developer productivity (along with build and test performance), but it’s a topic that isn’t discussed frequently. This paper from Google discusses their experience scaling Perforce: Google runs the busiest single Perforce server on the planet, and one of the largest repositories in any source control system. From this high-water mark this paper looks at server performance and other issues of scale, with digressions into where we are, how we got here, and how we continue to stay one step ahead of our users.. This paper is particularly impressive when you consider the difficulties that companies run into as they scale Git monorepos (talk to an ex-Twitter employee near you for war stories).|

      |“Large-Scale Automated Refactoring Using ClangMR”|Large codebases tend to age poorly, especially in the case of monorepos storing hundreds or thousands of different teams collaborating on different projects.  This paper covers one of Google’s attempts to reduce the burden of maintaining their large monorepo through tooling that makes it easy to rewrite abstract syntax trees (ASTs) across the entire codebase.  From the abstract: In this paper, we present a real-world implementation of a system to refactor large C++ codebases efficiently. A combination of the Clang compiler framework and the MapReduce parallel processor, ClangMR enables code maintainers to easily and correctly transform large collections of code. We describe the motivation behind such a tool, its implementation and then present our experiences using it in a recent API update with Google’s C++ codebase.. Similar work is being done with Pivot.|

      |“Source Code Rejuvenation is not Refactoring”|This paper introduces the concept of “code rejuvenation,” a unidirectional process of moving toward cleaner abstractions as new language features and libraries become available, which is particularly applicable to sprawling, older codebases.  From the abstract: In this paper, we present the notion of source code rejuvenation the automated migration of legacy code and very briefly mention the tools we use to achieve that. While refactoring improves structurally inadequate source code, source code rejuvenation leverages enhanced program language and library facilities by finding and replacing coding patterns that can be expressed through higher-level software abstractions. Raising the level of abstraction benefits software maintainability, security, and performance.. There are some strong echoes of this work in Google’s ClangMR paper.|

      |“Searching for Build Debt: Experiences Managing Technical Debt at Google”|This paper is an interesting cover of how to perform large-scale migrations in living codebases. Using broken builds as the running example, they break down their strategy into three pillars: automating, making it easy to do the right thing, and making it hard to do the wrong thing.  From the abstract: With a large and rapidly changing codebase, Google software engineers are constantly paying interest on various forms of technical debt. Google engineers also make efforts to pay down that debt, whether through special Fixit days, or via dedicated teams, variously known as janitors, cultivators, or demolition experts. We describe several related efforts to measure and pay down technical debt found in Google’s BUILD files and associated dead code. We address debt found in dependency specifications, unbuildable targets, and unnecessary command line flags. These efforts often expose other forms of technical debt that must first be managed|

      |“No Silver Bullet—Essence and Accident in Software Engineering”|A seminal paper from the author of The Mythical Man-Month, “No Silver Bullet” expands on discussions of accidental versus essential complexity, and argues that there is no longer enough accidental complexity to allow individual reductions in that accidental complexity to significantly increase engineer productivity.  From the abstract: Most of the big past gains in software productivity have come from removing artificial barriers that have made the accidental tasks inordinately hard, such as severe hardware constraints, awkward programming languages, lack of machine time. How much of what software engineers now do is still devoted to the accidental, as opposed to the essential? Unless it is more than 9/10 of all effort, shrinking all the accidental activities to zero time will not give an order of magnitude improvement.. I think that, interestingly, we do see accidental complexity in large codebases become large enough to make order-of-magnitude improvements (motivating, for example, Google’s investments in ClangMR and such), so perhaps we’re not quite as far ahead in the shift to essential complexity as we’d like to believe.|

      |“The UNIX Time-Sharing System”|This paper describes the fundamentals of UNIX as of 1974. What is truly remarkable is how many of the design decisions are still used today. From the permission model that we’ve all manipulated with chmod to system calls used to manipulate files, it’s amazing how much remains intact.  From the abstract: UNIX is a general-purpose, multi-user, interactive operating system for the Digital Equipment Corporation PDP-11/40 and 11/45 computers. It offers a number of features seldom found even in larger operating systems, including: (1) a hierarchical file system incorporating demountable volumes; (2) compatible file, device, and interprocess I/O; (3) the ability to initiate asynchronous processes; (4) system command language selectable on a per-user basis; and (5) over 100 subsystems including a dozen languages. This paper discusses the nature and implementation of the file system and of the user command interface.. Also fascinating is their observation that UNIX has in part succeeded because it was designed to solve a general problem by its authors (working with the PDP-7 was frustrating), rather than to progress toward a more specified goal.|