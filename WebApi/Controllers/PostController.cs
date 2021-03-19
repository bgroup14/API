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