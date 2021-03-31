using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class ChatRoomDTO
    {
        public int chatRoomId;
        public int otherMemberId;
        public string otherMemberName;
        public string otherMemberImage;
        public string latstSentence;
        public string lastDate;
        /*public int toMemberId;*/
    }

}