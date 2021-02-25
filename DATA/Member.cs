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
    
    public partial class Member
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Member()
        {
            this.Comments = new HashSet<Comment>();
            this.Likes = new HashSet<Like>();
            this.MembersCategories = new HashSet<MembersCategory>();
            this.MembersHobbies = new HashSet<MembersHobby>();
            this.MembersPosts = new HashSet<MembersPost>();
        }
    
        public int id { get; set; }
        public string email { get; set; }
        public string fullName { get; set; }
        public string facebookId { get; set; }
        public string googleId { get; set; }
        public string password { get; set; }
        public string biography { get; set; }
        public Nullable<int> genderId { get; set; }
        public Nullable<int> dateOfBirth { get; set; }
        public string occupation { get; set; }
        public string helpType { get; set; }
        public Nullable<int> numPosts { get; set; }
        public Nullable<int> numMeetingsSkipped { get; set; }
        public Nullable<int> rankLevel { get; set; }
        public string pictureUrl { get; set; }
        public Nullable<bool> isBanned { get; set; }
        public Nullable<int> systemScore { get; set; }
        public string gender { get; set; }
        public string city { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual Gender Gender { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Like> Likes { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MembersCategory> MembersCategories { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MembersHobby> MembersHobbies { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MembersPost> MembersPosts { get; set; }
    }
}
