using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class ReviewsDTO
    {
        public int id;
        public int fromMemberId;
        public int toMemberId;
        public string text;
        public string url;
        public int stars;
    }
}