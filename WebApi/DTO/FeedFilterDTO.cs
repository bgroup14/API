using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class FeedFilterDTO
    {
        public string userType;
        public string participantGender;
        public string participantAge;
        public string meetingLocation;
        public string sortBy;
        public string categoryName;
        public double meetingLocationLong;
        public double meetingLocationLat;
        public bool filterActivated;
    }

}

