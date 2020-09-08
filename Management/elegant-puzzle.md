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

## Reference Articles

[Effectively Using AWS Reserved Instances](Effectively Using AWS Reserved Instances)
