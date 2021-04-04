using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DATA
{
    [MetadataType(typeof(PostMetaData))]
    public partial class Post
    {

    }

    public class PostMetaData
    {


        [Required(AllowEmptyStrings = false, ErrorMessage = "Post content can't be empty")]
        public string text;

       

    }
}
