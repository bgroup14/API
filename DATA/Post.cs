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
    
    public partial class Post
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Post()
        {
            this.Comments = new HashSet<Comment>();
            this.Interactions = new HashSet<Interaction>();
            this.Likes = new HashSet<Like>();
            this.MembersPosts = new HashSet<MembersPost>();
            this.Interactions = new HashSet<Interaction>();
        }
    
        public int id { get; set; }
        public string text { get; set; }
        public Nullable<int> categoryId { get; set; }
        public Nullable<int> locationId { get; set; }
        public Nullable<int> fromGenderId { get; set; }
        public Nullable<int> fromAge { get; set; }
        public Nullable<int> toAge { get; set; }
        public string helpType { get; set; }
        public bool isZoom { get; set; }
        public Nullable<int> unixDate { get; set; }
        public bool recurring { get; set; }
        public Nullable<double> longitude { get; set; }
        public Nullable<double> latitude { get; set; }
        public string fromGender { get; set; }
        public string timeOfDay { get; set; }
        public Nullable<int> member_id { get; set; }
        public string category { get; set; }
        public string cityName { get; set; }
        public string dateLabel { get; set; }
    
        public virtual Category Category1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual Gender Gender { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Interaction> Interactions { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Like> Likes { get; set; }
        public virtual Location Location { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MembersPost> MembersPosts { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Interaction> Interactions { get; set; }
    }
}
