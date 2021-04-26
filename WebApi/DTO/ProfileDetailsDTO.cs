using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class ProfileDetailsDTO
    {
        public int age;
        public string occupation;
        public string city;
        public string bio;
        public string pictureUrl;
        public string fullName;
        public List<HobbiesDTO> hobbies;
        public string gender;
        public string dateOfBirth;
        public int? unixDate;
        public int memberId;
        public double rating;
        public int reviewsCount;
        public bool goldMember;
    }
}