using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class MeetingDTO
    {

        public string meetingDateLabel;
        public string meetingEventTitle;
        public string meetingTimeLabel;
        /*public int meetingUnixDate;*/
        /*public bool meetingMsg;*/
        public string meetingLocationLabel;
        public string otherMemberName;
        public string otherMemberImage;
        public int ?otherMemberId;

    }
}