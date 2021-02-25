using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class MemberSignupDTO
    {
        public string password;
        public string email;
        public string fullName;
        public string bio;
        public int dateOfBirth;
        public string occupation;
        public string pictureUrl;
        public string gender;
        public string city;

    }
}