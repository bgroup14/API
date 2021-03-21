using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class AuthorizedMemberDetailsDTO
    {
        public int id;
        public string name;
        public string helpType;
        public string participantGender;
        public string participantAge;
        public string meetingLocation;
        public string pictureUrl;
    }
}