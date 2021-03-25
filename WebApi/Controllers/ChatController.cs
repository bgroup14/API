using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using DATA;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApi.DTO;
namespace WebApi.Controllers

{
    [RoutePrefix("api/post")]
    public class ChatController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }


        [Route("getChats/{memberId}")]
        public List<ChatHistoryDTO> getChats(int memberId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            var chats = db.ChatHistories.Where(x => x.toMemberId == memberId || x.fromMemberId == memberId).Select(x => new ChatHistoryDTO()
            {
                messageId = x.messageId,
                datetime = (int)x.datetime,
                notificationId = (int)x.notificationId,
                fromMemberId = (int)x.fromMemberId,
                toMemberId = (int)x.toMemberId,

                //I need to verify this, maybe add another clause to receive both last recived and sent
                text = db.ChatHistories.Where(c => c.fromMemberId == x.fromMemberId).Where(c => c.toMemberId == x.toMemberId).Last().ToString()
            }).OrderByDescending(x => x.datetime).ToList();
            return chats;
        }


        [Route("getChats/{toMemberId}/{fromMemberId}")]
        public List<ChatHistoryDTO> getChatHistory(int toMemberId, int fromMemberId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            var chatMessages = db.ChatHistories.Where(x => (x.toMemberId == toMemberId && x.fromMemberId == fromMemberId) || (x.toMemberId == fromMemberId && x.fromMemberId == toMemberId)).Select(x => new ChatHistoryDTO()
            {
                messageId = x.messageId,
                datetime = (int)x.datetime,
                notificationId = (int)x.notificationId,
                fromMemberId = (int)x.fromMemberId,
                toMemberId = (int)x.toMemberId,

                //I need to verify this, maybe add another clause to receive both last recived and sent
                text = db.ChatHistories.Where(c => c.fromMemberId == x.fromMemberId).Where(c => c.toMemberId == x.toMemberId).Last().ToString()
            }).OrderByDescending(x => x.datetime).ToList();
            return chatMessages;
        }






        // POST api/<controller>


        [HttpPost]
        [Route("sendChatMessage")]
        public HttpResponseMessage PublishPost(ChatHistoryDTO message)
        {
            try
            {
                //////////////////////////////////////////////////////////
                ///                        TODO:                       ///
                ///  1. Send push and get notification ID via server   ///
                //////////////////////////////////////////////////////////

                int notificationId = 0;

                VolunteerMatchDbContext db = new VolunteerMatchDbContext();
                ChatHistory newMessage = new ChatHistory()
                {
                    datetime = message.datetime,
                    notificationId = notificationId,
                    fromMemberId = message.fromMemberId,
                    toMemberId = message.toMemberId,
                    text = message.text
                };
                db.ChatHistories.Add(newMessage);
                db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, "Message saved in DB");
            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

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