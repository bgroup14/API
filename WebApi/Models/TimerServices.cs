using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Web.Script.Serialization;
using System.Net;
using WebApi.DTO;
using DATA;

namespace GlobalTimerWebApi2.Models
{
    //code for timer
    public static class TimerServices
    {
        //code for timer
        public static void DoSomethingWithtimer(string path)
        {
            File.AppendAllText(path + "fileFromGATimer.txt", "hey  there time:" + DateTime.Now.ToString() + "\r\n");
        }

        public static void CheckMeetings()

        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            /* Test();*/
            try
            {
                var meetings = db.Meetings.ToList();
                foreach (var meeting in meetings)
                {
                    if (CheckIfShouldSendPush((int)meeting.meetingUnixDate))
                    {
                        Member firstMember = db.Members.Where(x => x.id == meeting.firstMemberId).FirstOrDefault();
                        SendPush(firstMember.notificationId);
                        Member secondMember = db.Members.Where(x => x.id == meeting.secondMemberId).FirstOrDefault();
                        SendPush(secondMember.notificationId);
                        //Add Notification To DB 

                        Notification firstNotification = new Notification()
                        {
                            memberId = firstMember.id,
                            notificationType = "meetingCheck",
                            otherMemberId = secondMember.id,
                            notificationText = $"Did you eventually meet {secondMember.fullName} for ${meeting.meetingEventTitle}?",
                            unixdate = (int)DateTimeOffset.Now.ToUnixTimeSeconds(),
                        };
                        Notification secondNotification = new Notification()
                        {
                            memberId = secondMember.id,
                            notificationType = "meetingCheck",
                            otherMemberId = firstMember.id,
                            notificationText = $"Did you eventually meet {firstMember.fullName} for ${meeting.meetingEventTitle}?",
                            unixdate = (int)DateTimeOffset.Now.ToUnixTimeSeconds(),
                        };


                        db.Notifications.Add(firstNotification);
                        db.Notifications.Add(secondNotification);



                        //DELETE MEETING FROM DB and adding notification to db
                        Meeting meetingTORemove = db.Meetings.Where(x => x.id == meeting.id).FirstOrDefault();
                        db.Meetings.Remove(meetingTORemove);





                    }

                }
                db.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }

            /* long now = DateTimeOffset.Now.ToUnixTimeSeconds();*/
            // here i will check all upcoimg meetings - if meetings passed 3 days - i will sendpush() for both users - and add notification of meetingCheck to both users
        }
        public static void Test()
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {

                Notification notificationn = new Notification()
                {
                    memberId = 157,
                    otherMemberId = 2,
                    notificationText = "nfrom server",
                    notificationType = "n",
                    unixdate = 1

                };
                db.Notifications.Add(notificationn);

                db.SaveChanges();
            }
            catch (Exception e)
            {

                SendPushCatch(e.InnerException.ToString());
            }

            /* db.SaveChangesAsync();*/
        }

        public static bool CheckIfShouldSendPush(int meetingDate)
        {
            DateTime now = DateTime.Now;
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(meetingDate).ToLocalTime();
            double daysPassedFromMeeting = (now - dtDateTime).TotalDays;
            /* long noww = DateTimeOffset.Now.ToUnixTimeSeconds();*/
            if (daysPassedFromMeeting >= 3)
            {
                return true;
            }
            return false;
        }

        public static void SendPush(string notificationId)
        {
            if (notificationId == null)
            {
                return;
            }
            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create("https://exp.host/--/api/v2/push/send");
            // Set the Method property of the request to POST.  
            request.Method = "POST";
            // Create POST data and convert it to a byte array. 
            var objectToSend = new
            {
                to = notificationId,
                title = "Meeting check title",
                body = "Meeting check body",
                /*badge = 7,*/
                /*data = new { name = "nir", grade = 100, seconds = DateTime.Now.Second }*/
                data = new { functionToRun = "meetingCheck" }
            };

            string postData = new JavaScriptSerializer().Serialize(objectToSend);

            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            // Set the ContentType property of the WebRequest.  
            request.ContentType = "application/json";
            // Set the ContentLength property of the WebRequest.  
            request.ContentLength = byteArray.Length;
            // Get the request stream.  
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.  
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.  
            dataStream.Close();
            // Get the response.  
            WebResponse response = request.GetResponse();
            // Display the status.  
            string returnStatus = ((HttpWebResponse)response).StatusDescription;
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            // Clean up the streams.  
            reader.Close();
            dataStream.Close();
            response.Close();

            /* return "success:) --- " + responseFromServer + ", " + returnStatus;*/

        }





        public static void SendPushCatch(string error)
        {

            // Create a request using a URL that can receive a post.   
            WebRequest request = WebRequest.Create("https://exp.host/--/api/v2/push/send");
            // Set the Method property of the request to POST.  
            request.Method = "POST";
            // Create POST data and convert it to a byte array. 
            var objectToSend = new
            {
                to = "ExponentPushToken[bd3PgHK1A50SU4Iyk3fNpX]",
                title = error,
                body = error,
                /*badge = 7,*/
                /*data = new { name = "nir", grade = 100, seconds = DateTime.Now.Second }*/
                data = new { functionToRun = "meetingCheck" }
            };

            string postData = new JavaScriptSerializer().Serialize(objectToSend);

            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            // Set the ContentType property of the WebRequest.  
            request.ContentType = "application/json";
            // Set the ContentLength property of the WebRequest.  
            request.ContentLength = byteArray.Length;
            // Get the request stream.  
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.  
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.  
            dataStream.Close();
            // Get the response.  
            WebResponse response = request.GetResponse();
            // Display the status.  
            string returnStatus = ((HttpWebResponse)response).StatusDescription;
            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.  
            dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.  
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.  
            string responseFromServer = reader.ReadToEnd();
            // Display the content.  
            //Console.WriteLine(responseFromServer);
            // Clean up the streams.  
            reader.Close();
            dataStream.Close();
            response.Close();

            /* return "success:) --- " + responseFromServer + ", " + returnStatus;*/

        }









        public class PushNotData
        {
            public string to { get; set; }
            public string title { get; set; }
            public string body { get; set; }
            public int badge { get; set; }
            public Data data { get; set; }
        }

        public class Data
        {
            public string functionToRun { get; set; }
            public int grade { get; set; }
            public string name { get; set; }
        }
    }
}