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
    
    public partial class Meeting
    {
        public int id { get; set; }
        public Nullable<int> firstMemberId { get; set; }
        public string meetingEventTitle { get; set; }
        public Nullable<int> secondMemberId { get; set; }
        public Nullable<int> meetingUnixDate { get; set; }
        public Nullable<int> locationId { get; set; }
        public Nullable<bool> didAccept { get; set; }
        public Nullable<bool> didHappen { get; set; }
        public string meetingDateLabel { get; set; }
        public string meetingTimeLabel { get; set; }
        public string meetingLocationLabel { get; set; }
        public Nullable<bool> didPushSent { get; set; }
    
        public virtual Location Location { get; set; }
    }
}
