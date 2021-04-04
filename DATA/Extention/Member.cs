using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DATA
{
    [MetadataType(typeof(MemberMetaData))]
    public partial class Member
    {

    }

    public class MemberMetaData
    {


        [Required(AllowEmptyStrings = false, ErrorMessage = "full name can't be empty")]
        public string fullName;

        [Required(AllowEmptyStrings = false, ErrorMessage = "bio can't be empty")]
        public string biography;

        [Required(AllowEmptyStrings = false, ErrorMessage = "occopation can't be empty")]
        public string occupation;

       
        [Required(AllowEmptyStrings = false, ErrorMessage = "pictureURL can't be empty")]
        public string pictureUrl;

        [Required(AllowEmptyStrings = false, ErrorMessage = "city can't be empty")]
        public string city;
        [Required(AllowEmptyStrings = false, ErrorMessage = "gender can't be empty")]
        public string gender;


       /* [MinLength(6, ErrorMessage = "Password must be at leasts 6 chars + ")]
        public string password;*/
    }
}