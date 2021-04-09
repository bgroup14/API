using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
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
                    var chatIds = db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).Select(y => y.fromMemberId).ToList();
                    int lastMessageSenderId = (int)chatIds[numOfMassages - 1];
                    var messageMarkAsReadList = db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).Select(y => y.markAsRead).ToList();
                    bool lastMessageMarkedAsRead = (bool)messageMarkAsReadList[numOfMassages - 1];

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
                        lastDate = lastDate,
                        lastMessageSenderId = lastMessageSenderId,
                        lastMessageMarkedAsRead = lastMessageMarkedAsRead,
                        lastUnixDate = lastUnixDate
                    };
                    chatRooms.Add(chatRoomDTO);


                }


                List<ChatRoomDTO> SortedList = chatRooms.OrderByDescending(o => o.lastUnixDate).ToList();


                return Request.CreateResponse(HttpStatusCode.OK, SortedList);


            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }



        }




        [HttpGet]
        [Route("getChatHistory/{chatRoomId}/{memberId}")]
        public HttpResponseMessage getChatHistory(int chatRoomId, int memberId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                var chats = db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).Select(x => new ChatHistoryDTO()
                {
                    messageId = x.messageId,
                    datetime = (int)x.datetime,
                    fromMemberId = (int)x.fromMemberId,
                    toMemberId = (int)x.toMemberId,
                    mine = (x.fromMemberId == memberId),

                    //I need to verify this, maybe add another clause to receive both last recived and sent
                    text = x.text,
                    //This applies only if its a neeting msg
                    meetingMsg = (bool)x.meetingMsg,
                    meetingDateLabel = x.meetingDateLabel,
                    meetingEventTitle = x.meetingEventTitle,
                    meetingUnixDate = (int)x.meetingUnixDate,
                    meetingTimeLabel = x.meetingTimeLabel
                }).OrderBy(x => x.datetime).ThenBy(z => z.messageId).ToList();
                return Request.CreateResponse(HttpStatusCode.OK, chats);
            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

        }


        [HttpGet]
        [Route("getChatRoomId/{memberId}/{otherMemberId}")]
        public HttpResponseMessage getChatRoomId(int memberId, int otherMemberId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                var chats = db.ChatHistories.Where(x => (x.fromMemberId == memberId && x.toMemberId == otherMemberId) || (x.fromMemberId == otherMemberId && x.toMemberId == memberId)).Select(x => new ChatRoomDTO()
                {
                    chatRoomId = (int)x.chatRoomId,
                    otherMemberName = db.Members.Where(z => z.id == otherMemberId).Select(y => y.fullName).FirstOrDefault(),
                    otherMemberImage = db.Members.Where(z => z.id == otherMemberId).Select(y => y.pictureUrl).FirstOrDefault()
                }).FirstOrDefault();

                if (chats == null)
                {
                    ChatRoomDTO newChatRoom = new ChatRoomDTO();
                    newChatRoom.otherMemberId = otherMemberId;
                    newChatRoom.otherMemberName = db.Members.Where(z => z.id == otherMemberId).Select(y => y.fullName).FirstOrDefault();
                    newChatRoom.otherMemberImage = db.Members.Where(z => z.id == otherMemberId).Select(y => y.pictureUrl).FirstOrDefault();
                    newChatRoom.chatRoomId = (int)db.ChatHistories.Max(x => x.chatRoomId) + 1;
                    return Request.CreateResponse(HttpStatusCode.OK, newChatRoom);
                }
                return Request.CreateResponse(HttpStatusCode.OK, chats);
            }
            catch (Exception ex)
            {


                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }


        // POST api/<controller>


        [HttpPost]
        [Route("sendChatMessage")]
        public HttpResponseMessage SaveChatMessage(ChatHistoryDTO message)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                //////////////////////////////////////////////////////////
                ///                        TODO:                       ///
                ///  1. CALCULATE DATETIME HERE                        ///
                //////////////////////////////////////////////////////////


                int datetime = (int)DateTimeOffset.Now.ToUnixTimeSeconds();
                ChatHistory newMessage = new ChatHistory()
                {
                    datetime = datetime,
                    fromMemberId = message.fromMemberId,
                    toMemberId = message.toMemberId,
                    text = message.text,
                    chatRoomId = message.chatRoomId
                };
                newMessage.markAsRead = false;
                newMessage.meetingMsg = false;
                newMessage.meetingUnixDate = 0;
                if (message.meetingMsg)
                {
                    newMessage.meetingMsg = true;
                    newMessage.meetingDateLabel = message.meetingDateLabel;
                    newMessage.meetingEventTitle = message.meetingEventTitle;
                    newMessage.meetingTimeLabel = message.meetingTimeLabel;
                    newMessage.meetingUnixDate = message.meetingUnixDate;
                    newMessage.meetingLocationLabel = message.meetingLocationLabel;
                    newMessage.text = "Meeting MSG";



                }
                db.ChatHistories.Add(newMessage);
                db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, "Message saved in DB");
            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

        }




        [HttpPost]
        [Route("markLastMassageRead/{chatRoomId}/{memberId}")]
        public HttpResponseMessage markLastMassageRead(int chatRoomId, int memberId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

                var messagesIds = db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).Select(y => y.messageId).ToList();
                int lastMessageInRoomId = messagesIds.Last();
                ChatHistory lastMessageInRoom = db.ChatHistories.Where(x => x.messageId == lastMessageInRoomId).FirstOrDefault();
                if (lastMessageInRoom.fromMemberId != memberId && lastMessageInRoom.markAsRead == false)
                {
                    lastMessageInRoom.markAsRead = true;
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Message marked as read");

                }


                return Request.CreateResponse(HttpStatusCode.OK, $"Last message is of user {memberId} or message was read already");

            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }









        [HttpPost]
        [Route("createMeeting/{chatRoomId}")]
        public HttpResponseMessage createMeeting(int chatRoomId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                var chatMassages = db.ChatHistories.Where(x => x.chatRoomId == chatRoomId).ToList();
                ChatHistory meetingMsg = chatMassages.Where(x => x.meetingMsg == true).FirstOrDefault();
                Meeting meeting = new Meeting()
                {
                    firstMemberId = (int)meetingMsg.fromMemberId,
                    secondMemberId = (int)meetingMsg.toMemberId,
                    meetingEventTitle = meetingMsg.meetingEventTitle,
                    meetingUnixDate = meetingMsg.meetingUnixDate,
                    didHappen = false,
                    meetingDateLabel = meetingMsg.meetingDateLabel,
                    meetingTimeLabel = meetingMsg.meetingTimeLabel,
                    meetingLocationLabel = meetingMsg.meetingLocationLabel
                };
                db.Meetings.Add(meeting);
                db.ChatHistories.Remove(meetingMsg);
                db.SaveChanges();




                return Request.CreateResponse(HttpStatusCode.OK, "Meeting saved in DB!");

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