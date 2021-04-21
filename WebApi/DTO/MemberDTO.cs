using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class MemberDTO
    {
        public int id;
        public string name;
        public string pictureUrl;
        public string helpType;
        public string gender;
        public int? dateOfBirth;
        public int age;
        public List<HobbiesDTO> hobbies;
        
    }
}