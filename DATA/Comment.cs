//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DATA
{
    using System;
    using System.Collections.Generic;
    
    public partial class Comment
    {
        public int id { get; set; }
        public Nullable<int> commentingMemberId { get; set; }
        public Nullable<int> postId { get; set; }
        public string text { get; set; }
    
        public virtual Member Member { get; set; }
        public virtual Post Post { get; set; }
    }
}