using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class CommentDTO
    {
        public string commentingMemberName;
        public string commentingMemberImage;
        public string text;
        public int commentingMemberId;
        public int postId;
        
    }
}