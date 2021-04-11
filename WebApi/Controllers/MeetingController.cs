using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;

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


                    }).ToList();

                foreach (MeetingDTO meetingDetails in upcomingMeetings)
                {
                    string otherMemberImageUrl = db.Members.Where(x => x.id == meetingDetails.otherMemberId).Select(y => y.pictureUrl).FirstOrDefault();
                    string otherMemberName = db.Members.Where(x => x.id == meetingDetails.otherMemberId).Select(y => y.fullName).FirstOrDefault();
                    meetingDetails.otherMemberImage = otherMemberImageUrl;
                    meetingDetails.otherMemberName = otherMemberName;
                }

                return Request.CreateResponse(HttpStatusCode.OK, upcomingMeetings);
            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

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