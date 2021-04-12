using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class NotificationDTO
    {
        public int notificationId;
        public int memberId;
        public string notificationType;
        public string notificationText;
        public int otherMemberId;
        public int unixdate;
        public string otherMemberImage;
        public string otherMemberName;


    }
}