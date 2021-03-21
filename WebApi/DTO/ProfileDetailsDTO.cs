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
        public List<HobbiesDTO> hobbies;
    }
}