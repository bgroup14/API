using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Spatial;
using System.Data.Entity.Validation;
using System.Device.Location;
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

        public HttpResponseMessage GetAllPosts()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

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





                return Request.CreateResponse(HttpStatusCode.OK, posts);
            }
            catch (Exception ex)
            {

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }


        }


        [HttpGet]
        [Route("getpostsbysearchword/{searchWord}")]

        public HttpResponseMessage GetPostsBySearchWord(string searchWord)
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

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
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }



        }










        [HttpGet]
        [Route("getuserposts/{id}/{mylong}/{mylat}")]

        public HttpResponseMessage GetUserPosts(int id, double mylong, double mylat)
        {


            double myLong = mylong;
            double myLat = mylat;


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

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
                    }).ToList(),


                    distanceFromMe = (double)(12742 * (double)System.Data.Entity.SqlServer.SqlFunctions.Asin(System.Data.Entity.SqlServer.SqlFunctions.SquareRoot((double)(0.5 - System.Data.Entity.SqlServer.SqlFunctions.Cos((double)(myLat - (double)x.latitude) * 0.017453292519943295) / 2 + System.Data.Entity.SqlServer.SqlFunctions.Cos((double)x.latitude * 0.017453292519943295) * System.Data.Entity.SqlServer.SqlFunctions.Cos((double)myLat * 0.017453292519943295) * (1 - System.Data.Entity.SqlServer.SqlFunctions.Cos((myLong - (double)x.longitude) * 0.017453292519943295)) / 2)))) // 2 * R; R = 6371 km
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      //distanceFromMe = (double)System.Data.Entity.SqlServer.SqlFunctions.SquareRoot((double)9)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      //distanceFromMe = (double)((x.latitude - filterDTO.meetingLocationLat) * (x.latitude - filterDTO.meetingLocationLat) + (x.longitude - filterDTO.meetingLocationLong) * (x.longitude - filterDTO.meetingLocationLong))





                }).ToList();

                return Request.CreateResponse(HttpStatusCode.OK, posts);
            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }



        }


        [HttpGet]
        [Route("getPostsFromCategry/{categoryId}")]

        public HttpResponseMessage getPostsFromCategry(string categoryId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

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
                return Request.CreateResponse(HttpStatusCode.OK, posts);
            }
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
                {
                    DbUpdateException e = (DbUpdateException)ex;
                    string errors = "";
                    foreach (DbEntityEntry entry in e.Entries)
                    {
                        errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                        foreach (string prop in entry.CurrentValues.PropertyNames)
                        {
                            errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                        }
                        errors += "---------------";
                    }
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "getPostsFromCategry Value saved in DB");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }

        [HttpGet]
        [Route("getPostsDateAscending")]

        public HttpResponseMessage getPostsDateAscending()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {

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
                return Request.CreateResponse(HttpStatusCode.OK, posts);
            }
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
                {
                    DbUpdateException e = (DbUpdateException)ex;
                    string errors = "";
                    foreach (DbEntityEntry entry in e.Entries)
                    {
                        errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                        foreach (string prop in entry.CurrentValues.PropertyNames)
                        {
                            errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                        }
                        errors += "---------------";
                    }
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "getPostsDateAscending Value saved in DB");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


        [HttpGet]
        [Route("getPostsDateDescending")]

        public HttpResponseMessage getPostsDateDescending()
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
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
                return Request.CreateResponse(HttpStatusCode.OK, posts);
            }
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
                {
                    DbUpdateException e = (DbUpdateException)ex;
                    string errors = "";
                    foreach (DbEntityEntry entry in e.Entries)
                    {
                        errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                        foreach (string prop in entry.CurrentValues.PropertyNames)
                        {
                            errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                        }
                        errors += "---------------";
                    }
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "getPostsDateDescending Value saved in DB");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


        [HttpPost]
        [Route("getFilteredPosts/{memberId}")]

        /*public List<PostDTO> GetFilteredPosts(FeedFilterDTO filterDTO, int memberId)*/
        public HttpResponseMessage GetFilteredPosts(FeedFilterDTO filterDTO, int memberId)
        {


            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {


                FeedSettingsDTO feedSettings = db.FeedSettings.Where(m => m.memberId == memberId).Select(x => new FeedSettingsDTO()
                {
                    memberType = x.memberType,
                    postLocation = x.postLocation,
                    participantGender = x.participantGender,
                    participantAgeRange = x.participantAgeRange
                }).FirstOrDefault();

                double myLong = filterDTO.meetingLocationLong;
                double myLat = filterDTO.meetingLocationLat;

                //Save location to DB
                Member member = (from m in db.Members where m.id == memberId select m).SingleOrDefault();
                member.lastLocationLat = myLat;
                member.lastLocationLong = myLong;
                db.SaveChanges();

                string categoryName = null;
                if (filterDTO.categoryName != null)
                {
                    categoryName = filterDTO.categoryName;
                }
                /* if (filterDTO != null)
                 {
                     myLong = filterDTO.meetingLocationLong;
                     myLat = filterDTO.meetingLocationLat;
                 }*/


                var smartElementPosts = findSimilarMembersPosts(memberId);

                var filteredPostsList = db.Posts.Where(p => p.member_id != memberId).Select(x => new PostDTO()
                {
                    id = (int)x.id,
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
                    authorGender = db.Members.Where(y => y.id == x.member_id).FirstOrDefault().gender,

                    comments = db.Comments.Where(c => c.postId == x.id).Select(y => new CommentDTO()
                    {
                        commentingMemberId = (int)y.commentingMemberId,
                        commentingMemberImage = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().pictureUrl,
                        commentingMemberName = db.Members.Where(m => m.id == (int)y.commentingMemberId).FirstOrDefault().fullName,
                        text = y.text
                    }).ToList(),

                    distanceFromMe = (double)(12742 * (double)System.Data.Entity.SqlServer.SqlFunctions.Asin(System.Data.Entity.SqlServer.SqlFunctions.SquareRoot((double)(0.5 - System.Data.Entity.SqlServer.SqlFunctions.Cos((double)(myLat - (double)x.latitude) * 0.017453292519943295) / 2 + System.Data.Entity.SqlServer.SqlFunctions.Cos((double)x.latitude * 0.017453292519943295) * System.Data.Entity.SqlServer.SqlFunctions.Cos((double)myLat * 0.017453292519943295) * (1 - System.Data.Entity.SqlServer.SqlFunctions.Cos((myLong - (double)x.longitude) * 0.017453292519943295)) / 2)))) // 2 * R; R = 6371 km
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      //distanceFromMe = (double)System.Data.Entity.SqlServer.SqlFunctions.SquareRoot((double)9)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      //distanceFromMe = (double)((x.latitude - filterDTO.meetingLocationLat) * (x.latitude - filterDTO.meetingLocationLat) + (x.longitude - filterDTO.meetingLocationLong) * (x.longitude - filterDTO.meetingLocationLong))
                    /*Coordinates = db.Posts.Where(z => z.id == x.id).Select(z => new GeoCoordinate(){
                        Latitude = (double)z.latitude,
                        Longitude = (double)z.longitude
                    }).ToList()*/

                }).OrderByDescending(x => x.id).ToList();

                var filteredPostsFinalList = filteredPostsList;
                if (smartElementPosts != null)
                {
                    filteredPostsFinalList = smartElementPosts;
                    List<int> filteredPostsFinalListIDs = new List<int>();
                    foreach (var post in smartElementPosts)
                    {
                        filteredPostsFinalListIDs.Add((int)post.id);
                    }
                    //for (int i = smartElementPosts.Count() - 1; i >= 0; i--)
                    foreach (var post in filteredPostsList)
                    {
                        if (!filteredPostsFinalListIDs.Contains((int)post.id))
                            filteredPostsFinalList.Add(post);
                    }
                }

                var filteredPosts = filteredPostsFinalList.AsQueryable();
                //return Request.CreateResponse(HttpStatusCode.OK, filteredPosts);


                if (filterDTO.filterActivated) // IT MEANS WE HAVE FILTER ACTIVATED
                {
                    // meetingLocation
                    if (filterDTO.meetingLocation != null)
                    {
                        if (filterDTO.meetingLocation.Equals("Zoom Only"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.isZoom == true);
                        }
                        else if (filterDTO.meetingLocation.Equals("My Area"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.distanceFromMe <= 5);
                            //filteredPosts = filteredPosts.Where(x => new GeoCoordinate(x.latitude, x.longitude).GetDistanceTo(userLocation) <= 5);
                        }
                        else if (filterDTO.meetingLocation.Equals("30KM"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.distanceFromMe <= 30);
                            //filteredPosts = filteredPosts.Where(x => new GeoCoordinate(x.latitude, x.longitude).GetDistanceTo(userLocation) <= 30);
                        }
                    }

                    //userType
                    if (filterDTO.userType != null)
                    {
                        /*if (filterDTO.userType.Equals("Need Help"))*/
                        if (filterDTO.userType == "Need Help")
                        {
                            /*filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Give Help"));*/
                            filteredPosts = filteredPosts.Where(m => m.helpType == "Give Help");
                        }
                        /* else if (filterDTO.userType.Equals("Give Help"))*/
                        else if (filterDTO.userType == "Give Help")
                        {
                            /*filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Need Help"));*/
                            filteredPosts = filteredPosts.Where(m => m.helpType == "Need Help");
                        }
                    }


                    //participantAge
                    if (filterDTO.participantAge != null)
                    {
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
                    }


                    //participantGender
                    if (filterDTO.participantGender != null)
                    {
                        if (filterDTO.participantGender.Equals("Man") || filterDTO.participantGender.Equals("Woman"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.fromGender.Equals(filterDTO.participantGender));
                        }
                    }


                    //categoryName
                    if (filterDTO.categoryName != null)
                    {
                        if (!filterDTO.categoryName.Equals("null"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.category.Equals(filterDTO.categoryName));
                        }
                    }
                    if (categoryName != null)
                    {
                        if (!categoryName.Equals("null"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.category.Equals(categoryName));
                        }
                    }

                    //sortBy
                    if (filterDTO.sortBy != null)
                    {
                        switch (filterDTO.sortBy)
                        {
                            case "Relevance":
                                //Need to setup smart element
                                // Show favorite categories first if categories selection is ALL
                                var categories = db.Interactions.Where(x => x.memberId == memberId).Select(g => new
                                {
                                    g.categoryName,
                                    g.strength
                                }).OrderByDescending(g => g.strength).Take(2).ToList();
                                List<String> preferences = new List<String>();
                                foreach (var category in categories)
                                {
                                    preferences.Add(category.categoryName);
                                }
                                filteredPosts = filteredPosts.OrderByDescending(
                                    item => preferences.IndexOf(item.category));
                                break;
                            case "Location":
                                filteredPosts = filteredPosts.OrderBy(y => y.distanceFromMe);
                                break;
                            case "Meeting date":
                                filteredPosts = filteredPosts.OrderByDescending(y => y.unixDate);
                                break;
                            default:
                                break;
                        }
                    }

                }
                else ///This run if filter is not activated - then we send posts by feedSettings
                {

                    // meetingLocation
                    // Show 30KM radius by default
                    //filteredPosts = filteredPosts.Where(m => m.distanceFromMe <= 30);

                    if (feedSettings.postLocation != null)
                    {
                        if (feedSettings.postLocation.Equals("Zoom Only"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.isZoom == true);
                        }
                        else if (feedSettings.postLocation.Equals("My Area"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.distanceFromMe <= 5);
                            //filteredPosts = filteredPosts.Where(x => new GeoCoordinate(x.latitude, x.longitude).GetDistanceTo(userLocation) <= 5);
                        }
                        else if (feedSettings.postLocation.Equals("30KM"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.distanceFromMe <= 30);
                            //filteredPosts = filteredPosts.Where(x => new GeoCoordinate(x.latitude, x.longitude).GetDistanceTo(userLocation) <= 30);
                        }
                    }


                    //userType
                    if (feedSettings.memberType == "Need Help")
                    {
                        filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Give Help"));
                    }
                    else if (feedSettings.memberType.Equals("Give Help"))
                    {
                        filteredPosts = filteredPosts.Where(m => m.helpType.Equals("Need Help"));

                    }

                    //participantAge
                    if (feedSettings.participantAgeRange != null)
                    {
                        switch (feedSettings.participantAgeRange)
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
                    }


                    //participantGender
                    if (feedSettings.participantGender != null)
                    {
                        if (feedSettings.participantGender.Equals("Man") || feedSettings.participantGender.Equals("Woman"))
                        {
                            //Offek: Alan please check this
                            if (feedSettings.memberType == "Need Help")
                            {
                                filteredPosts = filteredPosts.Where(m => m.authorGender.Equals(feedSettings.participantGender));
                            }
                            else
                            {
                                filteredPosts = filteredPosts.Where(m => m.fromGender.Equals(feedSettings.participantGender));
                            }
                        }
                    }

                    //categoryName
                    if (categoryName != null)
                    {
                        if (!categoryName.Equals("null"))
                        {
                            filteredPosts = filteredPosts.Where(m => m.category.Equals(categoryName));
                        }
                    }



                    //sortBy
                    if (filterDTO.sortBy != null)
                    {
                        switch (filterDTO.sortBy)
                        {
                            case "Relevance":
                                //Need to setup smart element
                                // Show favorite categories first if categories selection is ALL
                                var categories = db.Interactions.Where(x => x.memberId == memberId).Select(g => new
                                {
                                    g.categoryName,
                                    g.strength
                                }).OrderByDescending(g => g.strength).Take(2).ToList();
                                List<String> preferences = new List<String>();
                                foreach (var category in categories)
                                {
                                    preferences.Add(category.categoryName);
                                }
                                filteredPosts = filteredPosts.OrderByDescending(
                                    item => preferences.IndexOf(item.category));
                                break;
                            case "Location":
                                filteredPosts = filteredPosts.OrderBy(y => y.distanceFromMe);
                                break;
                            case "Meeting date":
                                filteredPosts = filteredPosts.OrderByDescending(y => y.unixDate);
                                break;
                            default:
                                break;
                        }
                    }
                }

                foreach (var post in filteredPosts)
                {
                    Member member1 = db.Members.Where(x => x.id == post.member_id).FirstOrDefault();
                    post.goldenMember = checkIfMemberGold(member1.id);

                };

                return Request.CreateResponse(HttpStatusCode.OK, filteredPosts);
                /* return filteredPosts.ToList();*/
            }
            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

        }

        public static bool checkIfMemberGold(int memberId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            var ratings = db.Reviews.Where(x => x.memberId == memberId).ToList();

            double rating = 0;
            double ratingSum = 0;
            int numOfRatings = ratings.Count();

            if (ratings.Count() > 0)
            {

                foreach (var r in ratings)
                {
                    ratingSum += (int)r.stars;
                };

                rating = ratingSum / (double)ratings.Count();
                rating = Math.Round(rating, 1);


                //CHECK IF GOLD MEMBER

                if (ratings.Count() >= 5 && rating > 4)
                {
                    return true;
                }

                return false;


            }
            return false;



        }





        // POST api/<controller>


        [HttpPost]
        [Route("publishpost")]
        public HttpResponseMessage PublishPost(PostDTO postDTO)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {

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
                MembersPost newMembersPost = new MembersPost()
                {
                    postId = newPost.id,
                    memberId = postDTO.member_id
                };
                db.MembersPosts.Add(newMembersPost);
                db.SaveChanges();
            }

            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

            return Request.CreateResponse(HttpStatusCode.OK, "Post saved in DB");


        }



        [HttpPost]
        [Route("publishcomment")]
        public HttpResponseMessage PublishComment(CommentDTO commentDTO)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Comment comment = new Comment()
                {
                    commentingMemberId = commentDTO.commentingMemberId,
                    postId = commentDTO.postId,
                    text = commentDTO.text
                };

                db.Comments.Add(comment);

                db.SaveChanges();
            }


            catch (DbEntityValidationException ex)
            {
                string errors = "";
                foreach (DbEntityValidationResult vr in ex.EntityValidationErrors)
                {
                    foreach (DbValidationError er in vr.ValidationErrors)
                    {
                        errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                    }
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);

            }
            catch (DbUpdateException ex)
            {
                DbUpdateException e = (DbUpdateException)ex;
                string errors = "";
                foreach (DbEntityEntry entry in e.Entries)
                {
                    errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                    foreach (string prop in entry.CurrentValues.PropertyNames)
                    {
                        errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                    }
                    errors += "---------------";
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }

            return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");



        }


        [HttpPost]
        [Route("publishlike")]
        public HttpResponseMessage PublishLike(LikeDTO likeDTO)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
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
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
                {
                    DbUpdateException e = (DbUpdateException)ex;
                    string errors = "";
                    foreach (DbEntityEntry entry in e.Entries)
                    {
                        errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                        foreach (string prop in entry.CurrentValues.PropertyNames)
                        {
                            errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                        }
                        errors += "---------------";
                    }
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Like saved success");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }


        [HttpDelete]
        [Route("deletepost/{postId}")]
        public HttpResponseMessage DeletePost(int postId)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
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


                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }

        }


        [HttpDelete]
        [Route("deletelike/{postId}/{memberId}")]
        public HttpResponseMessage DeleteLike(int postId, int memberId)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {
                Like likeToDelete = db.Likes.Where(x => x.postId == postId).Where(x => x.likingMemberId == memberId).FirstOrDefault();
                db.Likes.Remove(likeToDelete);

                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Like deleted");
            }
            catch (Exception ex)
            {
                if (ex is DbEntityValidationException)
                {
                    DbEntityValidationException e = (DbEntityValidationException)ex;
                    string errors = "";
                    foreach (DbEntityValidationResult vr in e.EntityValidationErrors)
                    {
                        foreach (DbValidationError er in vr.ValidationErrors)
                        {
                            errors += $"PropertyName - {er.PropertyName }, Error {er.ErrorMessage} <br/>";
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
                }
                else if (ex is DbUpdateException)
                {
                    DbUpdateException e = (DbUpdateException)ex;
                    string errors = "";
                    foreach (DbEntityEntry entry in e.Entries)
                    {
                        errors += $"Error in entity - {entry.Entity.GetType().Name}, entity state - {entry.State} <br/>";

                        foreach (string prop in entry.CurrentValues.PropertyNames)
                        {
                            errors += $"for column - {prop}, value - {entry.CurrentValues[prop]} <br/>";
                        }
                        errors += "---------------";
                    }
                }
                else if (ex is DbUpdateConcurrencyException)
                {
                    DbUpdateConcurrencyException e = (DbUpdateConcurrencyException)ex;
                    var ctx = ((IObjectContextAdapter)db).ObjectContext;
                    foreach (var et in e.Entries)
                    {
                        //client win
                        ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.ClientWins, et.Entity);

                        //store win
                        //ctx.Refresh(System.Data.Entity.Core.Objects.RefreshMode.StoreWins, et.Entity);
                    }
                    db.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK, "Like deleted");

                }

                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
            }
        }






        [HttpPatch]
        [Route("postIntercation/{memberId}/{categoryName}")]
        public HttpResponseMessage DeletePost(int memberId, string categoryName)
        {
            /*  return Request.CreateResponse(HttpStatusCode.OK, "Comment saved in DB");*/
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            try
            {

                Interaction interaction = db.Interactions.Where(x => x.memberId == memberId && categoryName == x.categoryName).FirstOrDefault();

                if (interaction == null)
                {
                    Interaction newIntercation = new Interaction()
                    {
                        categoryName = categoryName,
                        memberId = memberId,
                        strength = 1
                    };
                    db.Interactions.Add(newIntercation);
                }
                else
                {
                    interaction.strength = (int)interaction.strength + 1;
                }
                db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, "Category strength updated");

            }
            catch (Exception ex)
            {


                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Unknown error occured");
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


        //SMART ELEMENT

        //For debugging purposes, added Route. Will not be necessary in release
        [HttpGet]
        //[Route("findSimilarMembers/{memberId}")]
        public List<MemberDTO> findSimilarMembers(int memberId) //List<Member>
        {

            VolunteerMatchDbContext db = new VolunteerMatchDbContext();
            int datetimenow = (int)DateTimeOffset.Now.ToUnixTimeSeconds();
            try
            {

                //Get my age
                float age = 0;
                var myDateOfBirth = db.Members.Select(x => x.dateOfBirth).FirstOrDefault();
                if (myDateOfBirth != null)
                    age = (datetimenow - (int)myDateOfBirth) / 60 / 60 / 24 / 365;

                //Get my Hobbies
                var hobbies = db.MembersHobbies.Where(h => h.memberId == memberId).Select(z => new HobbiesDTO
                {
                    name = z.Hobby.name
                }).ToList();

                //Location
                float myLat = 0; //Change to 0
                if (db.Members.Where(m => m.id == memberId).Select(m => m.lastLocationLat).FirstOrDefault() != null)
                    myLat = float.Parse(db.Members.Where(m => m.id == memberId).Select(m => m.lastLocationLat).FirstOrDefault().ToString());
                float myLong = 0; //Change to 0
                if (db.Members.Where(m => m.id == memberId).Select(m => m.lastLocationLong).FirstOrDefault() != null)
                    myLong = float.Parse(db.Members.Where(m => m.id == memberId).Select(m => m.lastLocationLong).FirstOrDefault().ToString());


                //Favorite categories
                //select categoryName, SUM(strength) as strength from Interactions WHERE memberId = 157 group by categoryName ORDER BY strength DESC
                /*var categories = db.Interactions.Where(x => x.memberId == memberId).GroupBy(x => x.categoryName).Select(g => new {
                    categoryName = g.Key,
                    Strength = g.Sum(x => x.strength != null ? x.strength : 0)
                }).OrderByDescending(g => g.Strength).ToList();*/
                var categories = db.Interactions.Where(x => x.memberId == memberId).Select(g => new
                {
                    g.categoryName,
                    g.strength
                }).OrderByDescending(g => g.strength).Take(2).ToList();

                //Create string for categories to compare
                string categoriesString = "";
                for (int i = 0; i < 2; i++)
                {
                    if (i == 0)
                    {
                        categoriesString = categories[i].categoryName.ToString();
                    }
                    else
                    {
                        if (categoriesString.CompareTo(categories[i].categoryName.ToString()) < 0)
                        {
                            categoriesString = categoriesString + categories[i].categoryName.ToString();
                        }
                        else
                        {
                            categoriesString = categories[i].categoryName.ToString() + categoriesString;
                        }
                    }
                }
                string category1 = "";
                if (categories[0].categoryName != null)
                    category1 = categories[0].categoryName.ToString();
                string category2 = "";
                if (categories[1].categoryName != null)
                    category2 = categories[1].categoryName.ToString();

                //Fetch 20 members of close location
                var locationSimilarMembers = db.Members.Where(x => x.id != memberId && Math.Abs((float)x.lastLocationLat - myLat) <= 1 && Math.Abs((float)x.lastLocationLong - myLong) <= 1).Select(g => new
                { //0.4 ~ 30km
                    g.id,
                }).Take(20).ToList();

                //Fetch 20 members of similar categories
                var categorySimilarMembers = db.Interactions.OrderByDescending(x => x.strength).Where(x => x.memberId != memberId && (x.categoryName == category1 || x.categoryName == category2)).Select(g => new
                {
                    g.memberId,
                    g.categoryName,
                    g.strength
                }).Take(20).ToList();

                List<int> members = new List<int>();
                foreach (var member in locationSimilarMembers)
                {
                    if ((!members.Contains((int)member.id)))
                        members.Add((int)member.id);
                }
                foreach (var member in categorySimilarMembers)
                {
                    if ((!members.Contains((int)member.memberId)))
                        members.Add((int)member.memberId);
                }

                //Select members and filter using age
                var initialFilteredMembers = db.Members.Where(x => members.Contains(x.id)).Select(g => new
                {
                    g.id,
                    g.fullName,
                    g.dateOfBirth,
                    g.pictureUrl,
                    g.gender,
                    age = (g.dateOfBirth != null) ? (datetimenow - (int)g.dateOfBirth) / 60 / 60 / 24 / 365 : 0,
                    hobbies = db.MembersHobbies.Where(h => h.memberId == g.id).Select(z => new HobbiesDTO
                    {
                        name = z.Hobby.name
                    }).ToList()
                }).ToList();

                //Take these members and filter using hobbies
                members.Clear();
                members = new List<int>();
                foreach (var member in initialFilteredMembers)
                {
                    if (age > 0)
                    {
                        if (Math.Abs(member.age - age) <= 5)
                        {
                            if ((!members.Contains((int)member.id)))
                                members.Add((int)member.id);
                        }
                    }
                    if (hobbies.Count() > 0)
                    {
                        foreach (var myHobbie in hobbies)
                        {
                            foreach (var hobbie in member.hobbies)
                            {
                                if (myHobbie.name.Equals(hobbie.name))
                                {
                                    if ((!members.Contains((int)member.id)))
                                        members.Add((int)member.id);
                                    break;
                                }
                            }
                        }
                    }
                }

                var finalFilteredMembers = db.Members.Where(x => members.Contains(x.id)).Select(g => new MemberDTO
                {
                    id = g.id,
                    name = g.fullName,
                    dateOfBirth = g.dateOfBirth,
                    pictureUrl = g.pictureUrl,
                    gender = g.gender,
                    age = (g.dateOfBirth != null) ? (datetimenow - (int)g.dateOfBirth) / 60 / 60 / 24 / 365 : 0,
                    hobbies = db.MembersHobbies.Where(h => h.memberId == g.id).Select(z => new HobbiesDTO
                    {
                        name = z.Hobby.name
                    }).ToList()
                }).ToList();

                //Select members info and return in function

                return finalFilteredMembers;
                //return Request.CreateResponse(HttpStatusCode.OK, finalFilteredMembers);
            }
            catch (Exception e)
            {
                //return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error occured: "+e.ToString());
                return null;
            }
            //return Request.CreateResponse(HttpStatusCode.InternalServerError, "No results found");
        }

        //For debugging purposes, added Route. Will not be necessary in release
        //[HttpGet]
        //[Route("findSimilarMembersPosts/{memberId}")]
        public List<PostDTO> findSimilarMembersPosts(int memberId)
        {
            VolunteerMatchDbContext db = new VolunteerMatchDbContext();

            try
            {
                List<MemberDTO> members = findSimilarMembers(memberId);
                if (members == null)
                {
                    //If no similar members, don't look for posts
                    return null;
                }
                List<int> similarMembersIDs = new List<int>();
                foreach (var member in members)
                {
                    similarMembersIDs.Add((int)member.id);
                }
                string memberType = db.FeedSettings.Where(x => x.memberId == memberId).Select(x => x.memberType).FirstOrDefault().ToString();
                List<int> postIDs = new List<int>();

                //Fetch 5 posts of the member if exist
                var postsOfSimilarMembersInitial = db.Posts.Where(x => similarMembersIDs.Contains((int)x.member_id)).Select(x => new PostDTO()
                {
                    id = (int)x.id,
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
                var postsOfSimilarMembers = postsOfSimilarMembersInitial.ToList();
                if (!memberType.Equals("Both"))
                {
                    if (memberType.Equals("Give Help"))
                    {
                        postsOfSimilarMembers = postsOfSimilarMembersInitial.OrderByDescending(x => x.unixDate).Where(x => x.helpType == "Need Help").Take(5).ToList();
                    }
                    else if (memberType.Equals("Need Help"))
                    {
                        postsOfSimilarMembers = postsOfSimilarMembersInitial.OrderByDescending(x => x.unixDate).Where(x => x.helpType == "Give Help").Take(5).ToList();
                    }
                }
                else
                {
                    postsOfSimilarMembers = postsOfSimilarMembersInitial.OrderByDescending(x => x.unixDate).Take(5).ToList();
                }

                //Fetch 5 posts the similar member had interaction with if exist
                List<int> similarMembersInteractionOtherMemberIDs = new List<int>();
                var similarInteractions = db.InteractionsMembers.Where(x => similarMembersIDs.Contains((int)x.memberId)).OrderByDescending(x => x.strength).Take(5);
                foreach (var similarInteraction in similarInteractions)
                {
                    similarMembersInteractionOtherMemberIDs.Add((int)similarInteraction.otherMemberId);
                }

                var postsOfInteractedMembersInitial = db.Posts.Where(x => similarMembersInteractionOtherMemberIDs.Contains((int)x.member_id)).Select(x => new PostDTO()
                {
                    id = (int)x.id,
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
                var postsOfInteractedMembers = postsOfInteractedMembersInitial.ToList();
                if (!memberType.Equals("Both"))
                {
                    if (memberType.Equals("Give Help"))
                    {
                        postsOfInteractedMembers = postsOfSimilarMembersInitial.OrderByDescending(x => x.unixDate).Where(x => x.helpType == "Need Help").Take(5).ToList();
                    }
                    else if (memberType.Equals("Need Help"))
                    {
                        postsOfInteractedMembers = postsOfSimilarMembersInitial.OrderByDescending(x => x.unixDate).Where(x => x.helpType == "Give Help").Take(5).ToList();
                    }
                }
                else
                {
                    postsOfInteractedMembers = postsOfSimilarMembersInitial.OrderByDescending(x => x.unixDate).Take(5).ToList();
                }

                List<int> postsOfSimilarMembersIDs = new List<int>();
                foreach (var post in postsOfInteractedMembers)
                {
                    postsOfSimilarMembersIDs.Add((int)post.id);
                }
                foreach (var postOfInteracted in postsOfInteractedMembers)
                {
                    if (!postsOfSimilarMembersIDs.Contains((int)postOfInteracted.id))
                        postsOfSimilarMembers.Add(postOfInteracted);
                }

                return postsOfSimilarMembers;
                //return Request.CreateResponse(HttpStatusCode.OK, postsOfSimilarMembers.AsQueryable());
            }
            catch (Exception e)
            {
                //return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error occured: "+e.ToString());
                return null;
            }
        }
        /*double CalculateDistance(double longitudeA, double latitudeA, double longitudeB, double latitudeB)
        {
            if (longitudeA != 0 && latitudeA != 0 && longitudeA != 0 && longitudeB != 0)
            {
                var sCoord = new GeoCoordinate(longitudeA, latitudeA);
                var eCoord = new GeoCoordinate(longitudeB, latitudeB);

                return sCoord.GetDistanceTo(eCoord) / 1000;
            }

            return 0;

        }*/
    }
}