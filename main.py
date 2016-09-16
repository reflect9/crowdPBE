import re, os, logging, random, string, collections, json
import webapp2, jinja2
import datetime
import pprint
import csv, itertools, operator, copy
import webapp2
# from publisher import Publisher

from google.appengine.ext import ndb

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

HTML_SCORE_THREE_COURSES = "<ul class='objectList'><li>Name: Tom<br>Class: English<br>Score: 2<br></li><li>Name: Jane<br>Class: Biology<br>Score: 18<br></li><li>Name: Jane<br>Class: English<br>Score: 3<br></li><li>Name: Mike<br>Class: English<br>Score: 10<br></li><li>Name: Mike<br>Class: Biology<br>Score: 21<br></li><li>Name: Tom<br>Class: Biology<br>Score: 11<br></li></ul>"
TEXT_SCORE_THREE_COURSES = "Tom-English-2,<br> Jane-Biology-18,<br> Jane-English-3,<br> Mike-English-10,<br> Mike-Biology-21,<br> Tom-Biology-11"

def id_generator(size=4, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(size))

"""
DATA MODEL
"""
class Result(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    data = ndb.TextProperty()
class Result2(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    data = ndb.TextProperty()

"""
REQUEST HANDLERS
"""
def generateReportOneTrial(taskID, LogData):
    # FROM LOG DATA, GET LIST OF TRIALS, TOTAL TIME.
    trials = []
    #### SET UP THE FIRST TIMESTAMP
    lastTimeStamp = -1
    for log in LogData:
        if log['event']=="START_TASK" and log["tid"]==taskID:
            lastTimeStamp = log["timestamp"]
    ####
    for log in LogData:
        if log['event']=="INFER_PROGRAM" and log["tid"]==taskID:
            jsonPrograms = [pprint.pformat(v) for i,v in enumerate(log["detail"]["programs"])]
            if lastTimeStamp!= -1:
                duration = (log["time"]- lastTimeStamp) / 1000.0
            else:
                duration = 0
            lastTimeStamp = log["time"]
            oneTrial = {
                "event": log["event"],
                "data": log["detail"]["data"],
                "numProgList": log["detail"]["numProgList"],
                "jsonPrograms": jsonPrograms,
                "duration": duration
            }
            trials.append(oneTrial)
    ####
    for log in LogData:
        if log['event']=="GIVE_UP_TASK" and log["tid"]==taskID:
            trials.append({
                "event": log["event"]
            });
    return trials

class MainHandler(webapp2.RequestHandler):
    def get(self):
        mode = self.request.get("mode", default_value="hard")
        debug = self.request.get("debug", default_value="no")
        template_values = { 
            'mode':mode,
            'debug':debug,
            'taskcode': id_generator(),

        }
        template = JINJA_ENVIRONMENT.get_template('static/html/main.html')
        html = template.render(template_values)
        self.response.out.write(html)
       
class SubmitHandler(webapp2.RequestHandler):
    def post(self):
        data = self.request.get("data")
        res = Result2()
        res.data = data
        res.put()
    
class ReportHandler(webapp2.RequestHandler):
    def get(self):
        mode = self.request.get("mode", default_value="json")
        if mode=="json":
            res = Result2.query()
            dataList = [r.data for r in res]
            self.response.out.write(dataList)
        elif mode=="tasks":
            result_all = Result2.query()
            allData = [json.loads(result.data) for result in result_all]
            tid_list = ["tutorial_1", "tutorial_arith_1", "tutorial_arith_2", "tutorial_sum", "tutorial_text_extraction", "tutorial_filter_1", "task_three_step_arith", "task_number_sort", "task_filter_words_by_length", "task_filter_numbers", "task_extract_and_filter"]
            tasks_parts = []  # {} for j in range(len(allData))
            for ti in range(len(tid_list)):
                oneTask = []
                for pi in range(len(allData)):
                    taskCode = tid_list[ti]
                    # print taskCode
                    trials = generateReportOneTrial(taskCode, allData[pi]['log'])
                    onePart = {
                        "trials": trials,
                        "otherData": None
                    }
                    oneTask.append(onePart)
                    # print "participant:",pi, "task ", ti
                # pprint.pprint(oneTask)
                tasks_parts.append(oneTask)
            # pprint.pprint(tasks)
            template_values = {
                'tasks_parts':tasks_parts,
                'tid_list': tid_list,
                'allData':allData
            }
            template = JINJA_ENVIRONMENT.get_template('static/html/reportTasks.html')
            html = template.render(template_values)
            self.response.out.write(html)

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/submit', SubmitHandler),
    ('/report', ReportHandler)

], debug=True)
