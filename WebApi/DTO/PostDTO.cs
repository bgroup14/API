using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class PostDTO
    {
        public string text;
        public int fromAge;
        public int toAge;
        public string helpType;
        public bool isZoom;
        public int unixDate;
        public bool recurring;
        public string fromGender;
        public double longitude;
        public double latitude;
        public string timeOfDay;
        public int member_id;
        public string category;
        public string cityName;
        public string postCreatorImg;
        public string postCreatorName;
        public int postId;
        public string dateLabel;
        public List<CommentDTO> comments;
        public string authorGender;
        public double distanceFromMe;
    }
}