using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DATA
{
    [MetadataType(typeof(ChatHistoryMetaData))]
    public partial class ChatHistory
    {

    }

    public class ChatHistoryMetaData
    {
        [Required(AllowEmptyStrings = false, ErrorMessage = "Text message can't be empty")]
        public string text;
    }
}






