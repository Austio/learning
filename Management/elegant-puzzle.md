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

||Strategy|Vision|
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
   
Hero's
 - Kill the hero programmer or kill the environment that enables the hero
 - Projects fail all the time, acknowledge misteps that exacerbate mistakes and cut losses on bad decisions before burning ourselves out.  Then we can learn from our mistakes and improve.

## Reference Articles
[Effectively Using AWS Reserved Instances](Effectively Using AWS Reserved Instances)

