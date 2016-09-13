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
def extractLogDataForTask(taskID, LogData):
    # FROM LOG DATA, GET LIST OF TRIALS, TOTAL TIME.
    result = []
    for event in LogData:
        if 'tid' not in event['detail']:
            continue
        # print "--------"
        # print taskID, event['detail']['tid']
        if event['detail']['tid']==taskID:
            # print "event"
            # pprint.pprint(event)
            if event["event"]=="TEST_EXAMPLE":
                result.append(event['detail']['data'])
    return result

class MainHandler(webapp2.RequestHandler):
    def get(self):
        mode = self.request.get("mode", default_value="hard")
        template_values = { 
            'mode':mode,
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
            res = Result.query()
            dataList = [r.data for r in res]
            self.response.out.write(dataList)
        elif mode=="tasks":
            allResults = Result.query()
            allData = [json.loads(result.data) for result in allResults]
            tasks = [[{} for j in range(len(allData))] for i in range(17)]
            for pi in range(len(allData)):
                for ti in range(17):
                    tasks[ti][pi]["finalResult"] = allData[pi]['tasks'][ti]
                    try:
                        taskCode = allData[pi]['tasks'][ti]["tid"]
                        tasks[ti][pi]["trials"] = extractLogDataForTask(taskCode, allData[pi]['log'])
                        ## TASKS DO NOT HAVE ANY TRIAL. USE FINALRESULT INSTEAD
                        if len(tasks[ti][pi]["trials"])==0:
                            tasks[ti][pi]["trials"].append(tasks[ti][pi]["finalResult"])
                    except Exception as e:
                        # print "TID doesn't exist"
                        # print allData[pi]['tasks'][ti]
                        tasks[ti][pi]["trials"] = []
                    # print "participant:",pi, "task ", ti
                # pprint.pprint(tasks[ti])
            # pprint.pprint(tasks)
            template_values = {
                'allTasks':tasks,
                'allData':allData
            }
            template = JINJA_ENVIRONMENT.get_template('static/html/reportTasks.html')
            html = template.render(template_values)
            self.response.out.write(html)
    
class ReportHandler2(webapp2.RequestHandler):
    def get(self):
        mode = self.request.get("mode", default_value="json")
        if mode=="json":
            res = Result2.query()
            dataList = [r.data for r in res]
            self.response.out.write(dataList)
        elif mode=="tasks":
            allResults = Result2.query()
            allData = [json.loads(result.data) for result in allResults]
            tasks = [[{} for j in range(len(allData))] for i in range(17)]
            for pi in range(len(allData)):
                for ti in range(17):
                    tasks[ti][pi]["finalResult"] = allData[pi]['tasks'][ti]
                    try:
                        taskCode = allData[pi]['tasks'][ti]["tid"]
                        tasks[ti][pi]["trials"] = extractLogDataForTask(taskCode, allData[pi]['log'])
                        ## TASKS DO NOT HAVE ANY TRIAL. USE FINALRESULT INSTEAD
                        if len(tasks[ti][pi]["trials"])==0:
                            tasks[ti][pi]["trials"].append(tasks[ti][pi]["finalResult"])
                    except Exception as e:
                        # print "TID doesn't exist"
                        # print allData[pi]['tasks'][ti]
                        tasks[ti][pi]["trials"] = []
                    # print "participant:",pi, "task ", ti
                # pprint.pprint(tasks[ti])
            # pprint.pprint(tasks)
            template_values = {
                'allTasks':tasks,
                'allData':allData
            }
            template = JINJA_ENVIRONMENT.get_template('static/html/reportTasks.html')
            html = template.render(template_values)
            self.response.out.write(html)

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/submit', SubmitHandler),
    ('/report', ReportHandler),
    ('/report2', ReportHandler2),

], debug=True)
