using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class ChatHistoryDTO
    {
        public int id;
        public int messageId;
        public int datetime;
        public string text;
        public int fromMemberId;
        public int toMemberId;
        public int chatRoomId;
        public bool mine;
        public string meetingDateLabel;
        public string meetingEventTitle;
        public string meetingTimeLabel;
        public int meetingUnixDate;
        public bool meetingMsg;
        public string meetingLocationLabel;


    }
}