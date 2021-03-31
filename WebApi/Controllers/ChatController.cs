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
    [RoutePrefix("api/chat")]
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


        [HttpGet]
        [Route("getroomchats/{memberId}")]
        /* public List<ChatRoomDTO> getRoomChats(int memberId)*/
        public HttpResponseMessage getRoomChats(int memberId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                var allChatRoomsId = db.ChatHistories.Where(x => x.fromMemberId == memberId || x.toMemberId == memberId).Select(y => y.chatRoomId).ToList();
                List<int> relevantChatRoomsId = new List<int>();
                List<ChatRoomDTO> chatRooms = new List<ChatRoomDTO>();

                foreach (int chatRoomId in allChatRoomsId)
                {
                    if (!relevantChatRoomsId.Contains(chatRoomId))
                    {
                        relevantChatRoomsId.Add(chatRoomId);
                    }
                }

                foreach (var chatRoomId in relevantChatRoomsId)
                {
                    int firstMemberId = (int)db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).Select(y => y.fromMemberId).FirstOrDefault();
                    int SecondMemberId = (int)db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).Select(y => y.toMemberId).FirstOrDefault();
                    int otherMemberId;
                    if (firstMemberId == memberId)
                    {
                        otherMemberId = SecondMemberId;
                    }
                    else
                    {
                        otherMemberId = firstMemberId;
                    };

                    string otherMemberName = db.Members.Where(x => x.id == otherMemberId).Select(y => y.fullName).FirstOrDefault();
                    string otherMemberImage = db.Members.Where(x => x.id == otherMemberId).Select(y => y.pictureUrl).FirstOrDefault();
                    ChatHistory chatHistory = new ChatHistory();

                    //CHECK IF CAN BE OPTIMIZED
                    var chat = db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).Select(y => y.text).ToList();
                    var chatDate = db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).Select(y => y.datetime).ToList();
                    int numOfMassages = chat.Count();
                    string lastSentence = chat[numOfMassages - 1];
                    int lastUnixDate = (int)chatDate[numOfMassages - 1];

                    DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
                    dtDateTime = dtDateTime.AddSeconds(lastUnixDate).ToLocalTime();

                    //Checking if last massage was sent over the last 24 hrs
                    string lastDate;
                    DateTime now = DateTime.Now;
                    if (dtDateTime > now.AddHours(-24) && dtDateTime <= now)
                    {
                        decimal hours = Math.Floor((decimal)(now - dtDateTime).TotalHours);
                        int hoursDiffInt = (int)hours;
                        if (hoursDiffInt == 0)
                        {
                            lastDate = (now - dtDateTime).Minutes.ToString();
                            lastDate += " min ago";
                        }
                        else
                        {

                            lastDate = $"{hoursDiffInt}h ago";
                        }

                    }
                    else
                    {
                        string year = dtDateTime.Year.ToString();
                        string month = dtDateTime.Month.ToString();
                        string day = dtDateTime.Day.ToString();
                        lastDate = $"{day}/{month}/{year}";

                    };

                    ChatRoomDTO chatRoomDTO = new ChatRoomDTO()
                    {
                        chatRoomId = chatRoomId,
                        otherMemberId = otherMemberId,
                        otherMemberName = otherMemberName,
                        otherMemberImage = otherMemberImage,
                        latstSentence = lastSentence,
                        lastDate = lastDate
                    };
                    chatRooms.Add(chatRoomDTO);

                }
                return Request.CreateResponse(HttpStatusCode.OK, chatRooms);


            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }



        }














        [HttpGet]
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