using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using DATA;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApi.DTO;
namespace WebApi.Controllers

{
    [RoutePrefix("api/post")]
    public class PostController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }


        [HttpGet]
        [Route("getAllPosts")]

        public List<PostDTO> GetAllPosts()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            /*  string list = db.Members.Where(y => y.id == 157).First().fullName;*/
            var posts = db.Posts.Select(x => new PostDTO()
            {
                text = x.text,
                fromAge = (int)x.fromAge,
                toAge = (int)x.toAge,
                helpType = x.helpType,
                isZoom = x.isZoom,
                unixDate = (int)x.unixDate,
                recurring = x.recurring,
                fromGender = x.fromGender,
                longitude = (double)x.longitude,
                latitude = (double)x.latitude,
                timeOfDay = x.timeOfDay,
                category = x.category,
                member_id = (int)x.member_id,
                cityName = x.cityName,
                dateLabel = x.dateLabel,
                postId = x.id,
                postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                {
                    commentingMemberId = (int)y.commentingMemberId,
                    commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                    commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                    text = y.text
                }).ToList()



            }).ToList();
            return posts;



        }


        [HttpGet]
        [Route("getpostsbysearchword/{searchWord}")]

        public HttpResponseMessage GetPostsBySearchWord(string searchWord)
        {

            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();

                /*  string list = db.Members.Where(y => y.id == 157).First().fullName;*/
                var postsWIthSearchWord = db.Posts.Where(x => x.text.Contains(searchWord)).ToList();
                List<PostDTO> postsToSend = new List<PostDTO>();

                foreach (Post x in postsWIthSearchWord)
                {
                    PostDTO postDTO = new PostDTO()
                    {
                        text = x.text,
                        fromAge = (int)x.fromAge,
                        toAge = (int)x.toAge,
                        helpType = x.helpType,
                        isZoom = x.isZoom,
                        unixDate = (int)x.unixDate,
                        recurring = x.recurring,
                        fromGender = x.fromGender,
                        longitude = (double)x.longitude,
                        latitude = (double)x.latitude,
                        timeOfDay = x.timeOfDay,
                        category = x.category,
                        member_id = (int)x.member_id,
                        cityName = x.cityName,
                        dateLabel = x.dateLabel,
                        postId = x.id,
                        postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                        postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                        comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                        {
                            commentingMemberId = (int)y.commentingMemberId,
                            commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                            commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                            text = y.text
                        }).ToList()


                    };
                    postsToSend.Add(postDTO);

                }




                return Request.CreateResponse(HttpStatusCode.OK, postsToSend);

            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }



        }










        [HttpGet]
        [Route("getuserposts/{id}")]

        public List<PostDTO> GetUserPosts(int id)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            /*  string list = db.Members.Where(y => y.id == 157).First().fullName;*/
            var posts = db.Posts.Where(p => p.member_id == id).Select(x => new PostDTO()
            {

                text = x.text,
                fromAge = (int)x.fromAge,
                toAge = (int)x.toAge,
                helpType = x.helpType,
                isZoom = x.isZoom,
                unixDate = (int)x.unixDate,
                recurring = x.recurring,
                fromGender = x.fromGender,
                longitude = (double)x.longitude,
                latitude = (double)x.latitude,
                timeOfDay = x.timeOfDay,
                category = x.category,
                member_id = (int)x.member_id,
                cityName = x.cityName,
                dateLabel = x.dateLabel,
                postId = x.id,
                postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                {
                    commentingMemberId = (int)y.commentingMemberId,
                    commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                    commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                    text = y.text
                }).ToList()


            }).ToList();

            return posts;



        }


        [HttpGet]
        [Route("getPostsFromCategry/{categoryId}")]

        public List<PostDTO> getPostsFromCategry(string categoryId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            /*  string list = db.Members.Where(y => y.id == 157).First().fullName;*/
            var posts = db.Posts.Select(x => new PostDTO()
            {
                text = x.text,
                fromAge = (int)x.fromAge,
                toAge = (int)x.toAge,
                helpType = x.helpType,
                isZoom = x.isZoom,
                unixDate = (int)x.unixDate,
                recurring = x.recurring,
                fromGender = x.fromGender,
                longitude = (double)x.longitude,
                latitude = (double)x.latitude,
                timeOfDay = x.timeOfDay,
                category = x.category,
                member_id = (int)x.member_id,
                cityName = x.cityName,
                dateLabel = x.dateLabel,
                postId = x.id,
                postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                {
                    commentingMemberId = (int)y.commentingMemberId,
                    commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                    commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                    text = y.text
                }).ToList()



            }).Where(y => y.category == categoryId).ToList();
            return posts;
        }

        [HttpGet]
        [Route("getPostsDateAscending")]

        public List<PostDTO> getPostsDateAscending()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            /*  string list = db.Members.Where(y => y.id == 157).First().fullName;*/
            var posts = db.Posts.Select(x => new PostDTO()
            {
                text = x.text,
                fromAge = (int)x.fromAge,
                toAge = (int)x.toAge,
                helpType = x.helpType,
                isZoom = x.isZoom,
                unixDate = (int)x.unixDate,
                recurring = x.recurring,
                fromGender = x.fromGender,
                longitude = (double)x.longitude,
                latitude = (double)x.latitude,
                timeOfDay = x.timeOfDay,
                category = x.category,
                member_id = (int)x.member_id,
                cityName = x.cityName,
                dateLabel = x.dateLabel,
                postId = x.id,
                postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                {
                    commentingMemberId = (int)y.commentingMemberId,
                    commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                    commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                    text = y.text
                }).ToList()



            }).OrderBy(y => y.unixDate).ToList();
            return posts;
        }


        [HttpGet]
        [Route("getPostsDateDescending")]

        public List<PostDTO> getPostsDateDescending()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            /*  string list = db.Members.Where(y => y.id == 157).First().fullName;*/
            var posts = db.Posts.Select(x => new PostDTO()
            {
                text = x.text,
                fromAge = (int)x.fromAge,
                toAge = (int)x.toAge,
                helpType = x.helpType,
                isZoom = x.isZoom,
                unixDate = (int)x.unixDate,
                recurring = x.recurring,
                fromGender = x.fromGender,
                longitude = (double)x.longitude,
                latitude = (double)x.latitude,
                timeOfDay = x.timeOfDay,
                category = x.category,
                member_id = (int)x.member_id,
                cityName = x.cityName,
                dateLabel = x.dateLabel,
                postId = x.id,
                postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                {
                    commentingMemberId = (int)y.commentingMemberId,
                    commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                    commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                    text = y.text
                }).ToList()



            }).OrderByDescending(y => y.unixDate).ToList();
            return posts;
        }


        [HttpGet]
        [Route("getFilteredPosts")]

        public List<PostDTO> GetFilteredPostsPosts(FeedFilterDTO filterDTO)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            var filteredPosts = db.Posts.Select(x => new PostDTO()
            {
                text = x.text,
                fromAge = (int)x.fromAge,
                toAge = (int)x.toAge,
                helpType = x.helpType,
                isZoom = x.isZoom,
                unixDate = (int)x.unixDate,
                recurring = x.recurring,
                fromGender = x.fromGender,
                longitude = (double)x.longitude,
                latitude = (double)x.latitude,
                timeOfDay = x.timeOfDay,
                category = x.category,
                member_id = (int)x.member_id,
                cityName = x.cityName,
                dateLabel = x.dateLabel,
                postId = x.id,
                postCreatorName = db.Members.Where(y => y.id == (int)x.member_id).FirstOrDefault().fullName,
                postCreatorImg = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().pictureUrl,

                comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                {
                    commentingMemberId = (int)y.commentingMemberId,
                    commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                    commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                    text = y.text
                }).ToList()



            });

            // meetingLocation
            // STILL NEED TO DO
            // FIGURE OUT HOW TO COMPARE LOCATIONS IN MICROSOFT DB (radius using long/lat)

            //userType
            if (filterDTO.userType.Equals("Need help")) {
                filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Give help"));
            }
            else if (filterDTO.userType.Equals("Give help"))
            {
                filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Need help"));
            }

            //participantAge
            switch (filterDTO.participantAge)
            {
                case "16-30":
                    filteredPosts = filteredPosts.Where(m => m.fromAge >= 16 && m.toAge <= 30);
                    break;
                case "30-50":
                    filteredPosts = filteredPosts.Where(m => m.fromAge >= 30 && m.toAge <= 50);
                    break;
                case "50+":
                    filteredPosts = filteredPosts.Where(m => m.fromAge >= 50 && m.toAge <= 999);
                    break;
                default:
                    break;

            }

            //participantGender
            if (filterDTO.participantGender.Equals("Man") || filterDTO.participantGender.Equals("Woman"))
            {
                filteredPosts = filteredPosts.Where(m => m.fromGender.Equals(filterDTO.participantGender));
            }

            //categoryName
            if (filterDTO.categoryName != null && !filterDTO.categoryName.Equals("null"))
            {
                filteredPosts = filteredPosts.Where(m => m.category.Equals(filterDTO.categoryName));
            }

            //sortBy
            switch (filterDTO.sortBy)
            {
                case "Relevance":
                    //Need to setup smart element
                    break;
                case "Meeting location":
                    // SAME AS meetingLocation
                    // STILL NEED TO DO
                    // FIGURE OUT HOW TO COMPARE LOCATIONS IN MICROSOFT DB (radius using long/lat)
                    break;
                case "Meeting date":
                    filteredPosts = filteredPosts.OrderByDescending(y => y.unixDate);
                    break;
                default:
                    break;
            }

            return filteredPosts.ToList();
        }





        // POST api/<controller>


        [HttpPost]
        [Route("publishpost")]
        public HttpResponseMessage PublishPost(PostDTO postDTO)
        {
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();

                Post newPost = new Post()
                {
                    text = postDTO.text,
                    fromAge = postDTO.fromAge,
                    toAge = postDTO.toAge,
                    helpType = postDTO.helpType,
                    isZoom = postDTO.isZoom,
                    unixDate = postDTO.unixDate,
                    recurring = postDTO.recurring,
                    fromGender = postDTO.fromGender,
                    longitude = postDTO.longitude,
                    latitude = postDTO.latitude,
                    timeOfDay = postDTO.timeOfDay,
                    category = postDTO.category,
                    member_id = postDTO.member_id,
                    cityName = postDTO.cityName,
                    dateLabel = postDTO.dateLabel
                };
                db.Posts.Add(newPost);

                /*  return Request.CreateResponse(HttpStatusCode.OK, postDTO.latitude);*/


                MembersPost newMembersPost = new MembersPost()
                {
                    postId = newPost.id,
                    memberId = postDTO.member_id
                };
                db.MembersPosts.Add(newMembersPost);
                db.SaveChanges();


                return Request.CreateResponse(HttpStatusCode.OK, "Post saved in DB");




            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }



        [HttpPost]
        [Route("publishcomment")]
        public HttpResponseMessage PublishComment(CommentDTO commentDTO)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();
                Comment comment = new Comment()
                {
                    commentingMemberId = commentDTO.commentingMemberId,
                    postId = commentDTO.postId,
                    text = commentDTO.text
                };



                db.Comments.Add(comment);

                db.SaveChanges();


                return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");




            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }


        [HttpPost]
        [Route("publishlike")]
        public HttpResponseMessage PublishLike(LikeDTO likeDTO)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();
                Like like = new Like()
                {
                    likingMemberId = likeDTO.likingMemberId,
                    postId = likeDTO.postId
                };

                db.Likes.Add(like);
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Like saved success");
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        [HttpDelete]
        [Route("deletepost/{postId}")]
        public HttpResponseMessage DeletePost(int postId)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();
                Post postToDelete = db.Posts.Where(x => x.id == postId).First();
                db.Posts.Remove(postToDelete);
                MembersPost membersPostToDelete = db.MembersPosts.Where(x => x.postId == postId).First();
                db.MembersPosts.Remove(membersPostToDelete);


                foreach (Comment comment in db.Comments)
                {
                    if (comment.postId == postId)
                    {
                        db.Comments.Remove(comment);
                    }
                }
                db.SaveChanges();

                return Request.CreateResponse(HttpStatusCode.OK, "Post deleted from DB");




            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }


        [HttpDelete]
        [Route("deletelike/{postId}/{memberId}")]
        public HttpResponseMessage DeleteLike(int postId, int memberId)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            try
            {
                VolunteerMatchDbContext db = new VolunteerMatchDbContext();
                Like likeToDelete = db.Likes.Where(x => x.postId == postId).Where(x => x.likingMemberId == memberId).FirstOrDefault();
                db.Likes.Remove(likeToDelete);

                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Like deleted");
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}