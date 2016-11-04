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

tid_list = ["tutorial_1", "tutorial_arith_1", "tutorial_arith_2", "tutorial_sum", "tutorial_text_extraction", "tutorial_filter_1", "task_three_step_arith", "task_number_sort", "task_filter_words_by_length", "task_filter_numbers", "task_extract_and_filter"]
code_list = ['EMPTY_CELL','INCONSISTENT_TYPE','FILTER_WITHOUT_TF','FILTER_AND_EXTRACT','TF_WITHOUT_NUMBER','NO_PROGRAM_FOUND']

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
class Result3(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    data = ndb.TextProperty()

### MIXED-INITIATIVE PBE (Nov4)
class Result4(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    data = ndb.TextProperty()


class Log(ndb.Model):
    created = ndb.DateTimeProperty(auto_now_add=True)
    ip = ndb.StringProperty()
    data = ndb.TextProperty()    

"""
REQUEST HANDLERS
"""
def generateReportAllTrials(DataParticipant):
    return [generateReportOneTrial(tid, DataParticipant["log"]) for tid in tid_list]

def generateReportOneTrial(taskID, LogData):
    # FROM LOG DATA, GET LIST OF TRIALS, TOTAL TIME.
    trials = []
    failMessages = {}
    #### SET UP THE FIRST TIMESTAMP
    totalDuration = 0
    numInference = 0
    lastTimeStamp = -1
    isSuccess = True
    for log in LogData:
        # print log
        if log['event']=="START_TASK" and log["tid"]==taskID:
            lastTimeStamp = log["timestamp"]
    ####
    for log in LogData:
        if log['tid']!=taskID: continue
        if log['event']=="INFER_PROGRAM":
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
            totalDuration += duration
            numInference += 1
            trials.append(oneTrial)
        if log['event']=="GIVE_UP_TASK":
            isSuccess = False
            trials.append({
                "event": log["event"]
            });
        if log['event']=="SHOW_SOLUTION":
            isSuccess = False
            trials.append({
                "event": log["event"]
            });
        if log['event']=="FAIL_MESSAGE":
            messages = log['detail']['code']
            for message in messages:
                if message not in failMessages:
                    failMessages[message] = 0
                failMessages[message] += 1
    #### NOW CREATE SUMMARY
    summary = {
        "isSuccess" : isSuccess,
        "duration":totalDuration,
        "numInference":numInference,
        "failMessages":failMessages
    }

    report = {
        'trials':trials,
        'summary':summary
    }
    return report

class MainHandler(webapp2.RequestHandler):
    def get(self):
        mode = self.request.get("mode",default_value="unspecified")
        print "mode", mode 
        if mode == "unspecified":
            count_baseline = 0
            count_experimental = 0
            result_all = Result3.query()
            for result in result_all:
                data = json.loads(result.data)
                if data["mode"]=="baseline":
                    count_baseline+=1
                elif data["mode"]=="experimental":
                    count_experimental += 1
            print "baseline:", count_baseline, "experimental:", count_experimental
            if count_baseline<count_experimental:
                mode = "baseline"
            else:
                mode = "experimental"
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
        res = Result3()
        res.data = data
        res.put()
class LogHandler(webapp2.RequestHandler):
    def get(self):
        ip = self.request.remote_addr
        data = self.request.get("data")
        res = Log()
        res.ip = ip
        res.data = data
        res.put()

class ReportHandler(webapp2.RequestHandler):
    def get(self):
        mode = self.request.get("mode", default_value="json")
        if mode=="json":
            res = Result3.query()
            dataList = [r.data for r in res]
            template_values = { 
                'dataList':dataList,
                'jsonFileName':'report.json'
            }
            template = JINJA_ENVIRONMENT.get_template('static/html/downloadJSON.html')
            html = template.render(template_values)
            self.response.out.write(html)
        elif mode=="tasks":
            result_all = Result3.query()
            allData = [json.loads(result.data) for result in result_all]
            tasks_parts = []  # {} for j in range(len(allData))
            for ti in range(len(tid_list)):
                oneTask = []
                for pi in range(len(allData)):
                    taskCode = tid_list[ti]
                    # print taskCode
                    reportOneData = generateReportOneTrial(taskCode, allData[pi]['log'])
                    onePart = {
                        "trials": reportOneData['trials'],
                        "summary": reportOneData["summary"],
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
        elif mode=="stat":
            result_all = Result3.query()
            allData = [json.loads(result.data) for result in result_all]
            
        elif mode=="progress":
            result_all = Result3.query()
            allData = [json.loads(result.data) for result in result_all]
            participants_baseline = [generateReportAllTrials(part) for part in allData if part["mode"]=="baseline"]
            participants_experimental = [generateReportAllTrials(part) for part in allData if part["mode"]=="experimental"]
            template_values = {
                'tid_list': tid_list,
                'allData':allData,
                'participants_baseline': participants_baseline,
                'participants_experimental': participants_experimental
            }
            template = JINJA_ENVIRONMENT.get_template('static/html/reportProgress.html')
            html = template.render(template_values)
            self.response.out.write(html)


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/submit', SubmitHandler),
    ('/log', LogHandler),
    ('/report', ReportHandler)

], debug=True)
