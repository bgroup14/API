﻿using System;
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
                };
                db.Posts.Add(newPost);

                /*return Request.CreateResponse(HttpStatusCode.OK, "Post saved in DB");*/


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