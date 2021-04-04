using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DATA
{
    [MetadataType(typeof(CommentMetaData))]
    public partial class Comment
    {
        
    }

    public class CommentMetaData
    {


        [Required(AllowEmptyStrings = false,ErrorMessage ="Comment can't be empty")]
        public string text;
    }
}
