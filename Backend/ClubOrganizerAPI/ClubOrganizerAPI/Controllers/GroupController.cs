using Context;
using Context.DAL;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ClubOrganizerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupController : ControllerBase
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;

        [HttpPost("CreatGroup")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Group))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Group>> CreateGroup([Required][FromBody] Group groupData)
        {
            Group gr = await mongo.Group.InsertOrUpdateOneAsync(groupData);


            if (gr != null)
            {


                return gr;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpPatch("PatchGroup")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Group))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Group>> PatchGroup([FromQuery][Required] String id, [Required][FromBody] Group groupData)
        {
            Group grp = await mongo.Group.FindByIdAsync(id);


            if (grp != null)
            {
                Group patch = await mongo.Group.UpdateOneAsync(groupData);


                return patch;
            }
            else
            {
                return NotFound();
            }

        }

        [HttpDelete("DeleteGroup")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Group))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> DeleteGroup([FromQuery][Required] String id)
        {
            Group grp = await mongo.Group.FindByIdAsync(id);


            if (grp != null)
            {
                await mongo.Group.DeleteByIdAsync(id);


                return grp.Name + "Deleted Successfully";
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet("ListGroups")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<Group>))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<Group>>> ListGroups()
        {


            List<Group> grps = mongo.Group.FilterBy(x => true).ToList();


            if (grps != null)
            {


                return grps;
            }
            else
            {
                return NotFound();
            }

        }
    }
}
