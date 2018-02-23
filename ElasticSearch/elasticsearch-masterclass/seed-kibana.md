PUT /courses/classroom/1
{
    "name": "Accounting 101",
    "room": "E3",
    "professor": {
        "name": "Thomas Baszo",
        "department": "finance",
        "facutly_type": "part-time",
        "email": "baszot@onuni.com"
        },
    "students_enrolled": 27,
    "course_publish_date": "2015-01-19",
    "course_description": "Act 101 is a course from the business school on the introduction to accounting that teaches students how to read and compose basic financial statements"
}

PUT /courses/classroom/2
{
    "name": "Marketing 101",
    "room": "E4",
    "professor": {
        "name": "William Smith",
        "department": "finance",
        "facutly_type": "part-time",
        "email": "wills@onuni.com"
        },
    "students_enrolled": 18,
    "course_publish_date": "2015-06-21",
    "course_description": "Mkt 101 is a course from the business school on the introduction to marketing that teaches students the fundamentals of market analysis, customer retention and online advertisements"
}

PUT /courses/classroom/3
{
    "name": "Anthropology 230",
    "room": "G11",
    "professor": {
        "name": "Devin Cranford",
        "department": "history",
        "facutly_type": "full-time",
        "email": "devinc@onuni.com"
        },
    "students_enrolled": 22,
    "course_publish_date": "2013-08-27",
    "course_description": "Ant 230 is an intermediate course on human societies and cultures and their development. A focus on the Mayans civilization is rooted in this course"
}

PUT /courses/classroom/4
{
    "name": "Computer Science 101",
    "room": "C12",
    "professor": {
        "name": "Gregg Payne",
        "department": "engineering",
        "facutly_type": "full-time",
        "email": "payneg@onuni.com"
        },
    "students_enrolled": 33,
    "course_publish_date": "2013-08-27",
    "course_description": "CS 101 is a first year computer science introduction teaching fundamental data structures and alogirthms using python. "
}

PUT /courses/classroom/5
{
    "name": "Theatre 410",
    "room": "T18",
    "professor": {
        "name": "Sebastian Hern",
        "department": "art",
        "facutly_type": "part-time",
        "email": ""
        },
    "students_enrolled": 47,
    "course_publish_date": "2013-01-27",
    "course_description": "Tht 410 is an advanced elective course disecting the various plays written by shakespere during the 16th century"
}

PUT /courses/classroom/6
{
    "name": "Cost Accounting 400",
    "room": "E7",
    "professor": {
        "name": "Bill Cage",
        "department": "accounting",
        "facutly_type": "full-time",
        "email": "cageb@onuni.com"
        },
    "students_enrolled": 31,
    "course_publish_date": "2014-12-31",
    "course_description": "Cst Act 400 is an advanced course from the business school taken by final year accounting majors that covers the subject of business incurred costs and how to record them in financial statements"
}

PUT /courses/classroom/7
{
    "name": "Computer Internals 250",
    "room": "C8",
    "professor": {
        "name": "Gregg Payne",
        "department": "engineering",
        "facutly_type": "part-time",
        "email": "payneg@onuni.com"
        },
    "students_enrolled": 33,
    "course_publish_date": "2012-08-20",
    "course_description": "cpt Int 250 gives students an integrated and rigorous picture of applied computer science, as it comes to play in the construction of a simple yet powerful computer system. "
}

PUT /courses/classroom/8
{
    "name": "Accounting Info Systems 350",
    "room": "E3",
    "professor": {
        "name": "Bill Cage",
        "department": "accounting",
        "facutly_type": "full-time",
        "email": "cageb@onuni.com"
        },
    "students_enrolled": 19,
    "course_publish_date": "2014-05-15",
    "course_description": "Act Sys 350 is an advanced course providing students a practical understanding of an accounting system in database technology. Students will use MS Access to build a transaction ledger system"
}

PUT /courses/classroom/9
{
    "name": "Tax Accounting 200",
    "room": "E7",
    "professor": {
        "name": "Thomas Baszo",
        "department": "finance",
        "facutly_type": "part-time",
        "email": "baszot@onuni.com"
        },
    "students_enrolled": 17,
    "course_publish_date": "2016-06-15",
    "course_description": "Tax Act 200 is an intermediate course covering various aspects of tax law"
}

PUT /courses/classroom/10
{
    "name": "Capital Markets 350",
    "room": "E3",
    "professor": {
        "name": "Thomas Baszo",
        "department": "finance",
        "facutly_type": "part-time",
        "email": "baszot@onuni.com"
        },
    "students_enrolled": 13,
    "course_publish_date": "2016-01-11",
    "course_description": "This is an advanced course teaching crucial topics related to raising capital and bonds, shares and other long-term equity and debt financial instrucments"
}

POST /vehicles/cars/_bulk
{ "index": {}}
{ "price" : 10000, "color" : "white", "make" : "honda", "sold" : "2016-10-28", "condition": "okay"}
{ "index": {}}
{ "price" : 20000, "color" : "white", "make" : "honda", "sold" : "2016-11-05", "condition": "new" }
{ "index": {}}
{ "price" : 30000, "color" : "green", "make" : "ford", "sold" : "2016-05-18", "condition": "new" }
{ "index": {}}
{ "price" : 15000, "color" : "blue", "make" : "toyota", "sold" : "2016-07-02", "condition": "good" }
{ "index": {}}
{ "price" : 12000, "color" : "green", "make" : "toyota", "sold" : "2016-08-19" , "condition": "good"}
{ "index": {}}
{ "price" : 18000, "color" : "red", "make" : "dodge", "sold" : "2016-11-05", "condition": "good"  }
{ "index": {}}
{ "price" : 80000, "color" : "red", "make" : "bmw", "sold" : "2016-01-01", "condition": "new"  }
{ "index": {}}
{ "price" : 25000, "color" : "blue", "make" : "ford", "sold" : "2016-08-22", "condition": "new"  }
{ "index": {}}
{ "price" : 10000, "color" : "gray", "make" : "dodge", "sold" : "2016-02-12", "condition": "okay" }
{ "index": {}}
{ "price" : 19000, "color" : "red", "make" : "dodge", "sold" : "2016-02-12", "condition": "good" }
{ "index": {}}
{ "price" : 20000, "color" : "red", "make" : "chevrolet", "sold" : "2016-08-15", "condition": "good" }
{ "index": {}}
{ "price" : 13000, "color" : "gray", "make" : "chevrolet", "sold" : "2016-11-20", "condition": "okay" }
{ "index": {}}
{ "price" : 12500, "color" : "gray", "make" : "dodge", "sold" : "2016-03-09", "condition": "okay" }
{ "index": {}}
{ "price" : 35000, "color" : "red", "make" : "dodge", "sold" : "2016-04-10", "condition": "new" }
{ "index": {}}
{ "price" : 28000, "color" : "blue", "make" : "chevrolet", "sold" : "2016-08-15", "condition": "new" }
{ "index": {}}
{ "price" : 30000, "color" : "gray", "make" : "bmw", "sold" : "2016-11-20", "condition": "good" }
