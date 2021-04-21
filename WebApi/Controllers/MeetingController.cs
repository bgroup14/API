using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;



using System.Web.Script.Serialization;

using System.IO;

using System.Text;



namespace WebApi.Controllers
{

    [RoutePrefix("api/meeting")]
    public class MeetingController : ApiController
    {

        [HttpGet]
        [Route("getUpcomingMeetings/{memberId}")]

        public HttpResponseMessage GetUpcomingMeetings(int memberId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            int today = (int)DateTimeOffset.Now.ToUnixTimeSeconds();

            try
            {

                List<MeetingDTO> upcomingMeetings = db.Meetings.Where
                    (x => x.firstMemberId == memberId && x.meetingUnixDate > today ||
                    x.secondMemberId == memberId && x.meetingUnixDate > today)
                    .Select(m => new MeetingDTO
                    {
                        meetingDateLabel = m.meetingDateLabel,
                        meetingEventTitle = m.meetingEventTitle,
                        meetingLocationLabel = m.meetingLocationLabel,
                        meetingTimeLabel = m.meetingTimeLabel,
                        otherMemberId = m.secondMemberId == memberId ? m.firstMemberId : m.secondMemberId,
                        meetingUnixDate = (int)m.meetingUnixDate


                    }).ToList();

                foreach (MeetingDTO meetingDetails in upcomingMeetings)
                {
                    string otherMemberImageUrl = db.Members.Where(x => x.id == meetingDetails.otherMemberId).Select(y => y.pictureUrl).FirstOrDefault();
                    string otherMemberName = db.Members.Where(x => x.id == meetingDetails.otherMemberId).Select(y => y.fullName).FirstOrDefault();
                    meetingDetails.otherMemberImage = otherMemberImageUrl;
                    meetingDetails.otherMemberName = otherMemberName;
                }

                List<MeetingDTO> sortedMeetingsList = upcomingMeetings.OrderBy(o => o.meetingUnixDate).ToList();

                return Request.CreateResponse(HttpStatusCode.OK, sortedMeetingsList);
            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

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




       
        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}