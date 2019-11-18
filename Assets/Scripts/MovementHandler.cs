using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MovementHandler : MonoBehaviour
{
    [SerializeField] private float speed = 6f;  // character walks at this constant speed
    private Vector3 moveDir;
    private Vector3 clearDir;
    private Vector3 lastDir;
    private Rigidbody2D body;
    private BoxCollider2D bodyCollider;
    private ContactPoint2D[] contacts;
    private LayerMask wallMask;     // to filter for RaycastHits into walls

    private Animator anim;


    // Helper function to flip direction that character is facing
    private void FlipPlayerDir()
    {
        // Flip direction that character is facing
        Vector3 tempScale = this.transform.localScale;
        tempScale.x *= -1;
        this.transform.localScale = tempScale;
    }

    private void MoveAlongWall()
    {

    }

    void Awake()
    {
        this.moveDir = new Vector3(0f, 0f);
        this.clearDir = new Vector3(0f, 0f);
        this.lastDir = new Vector3(0f, 0f);

        this.body = this.gameObject.GetComponent<Rigidbody2D>();
        this.bodyCollider = this.gameObject.GetComponent<BoxCollider2D>();
        this.contacts = new ContactPoint2D[8];
        this.wallMask = LayerMask.GetMask("Wall");

        this.anim = this.gameObject.GetComponent<Animator>();
    }

   
    // Update is called once per frame
    void Update()
    {
        // Read the user's movement inputs
        this.moveDir.x = Input.GetAxisRaw("Horizontal");
        this.moveDir.y = Input.GetAxisRaw("Vertical");
        this.moveDir.Normalize();
         
        // If moveDir is non-zero, play walking animation in correct dir
        if ( this.moveDir.magnitude != 0f  )
        {
            // Determine direction of walking animation
            bool wasFacingLeft = (this.transform.localScale.x < 0);

            if ( this.moveDir.x < 0 && !wasFacingLeft )
            {
                // moving left, previously facing right
                FlipPlayerDir();
            } else if ( this.moveDir.x > 0 && wasFacingLeft ) {
                // moving right, previously facing left
                FlipPlayerDir();
            }

            // Activate Walk animation
            this.anim.SetBool("isWalking", true);
        } else {
            this.anim.SetBool("isWalking", false);
        }
    }

   
    // FixedUpdate is called 0..n times per frame before physics calculations
    private void FixedUpdate()
    {
        //bool movingDiag = (this.moveDir.x != 0 & this.moveDir.y != 0);

        // for Raycast to actually extrude from player's body
        //Vector3 bodyWidth = this.bodyCollider.bounds.ClosestPoint(this.transform.position + moveDir);
        //Debug.DrawRay(bodyWidth, moveDir);

        int numContacts = this.body.GetContacts(this.contacts);
        float bodyWidth = 1f;
        float rayDist = bodyWidth + (this.speed * Time.fixedDeltaTime);

        // Set this.body.velocity for general case
        // Will be changed later if must slide along wall
        this.body.velocity = this.moveDir * this.speed;

        if( (numContacts > 0) )
        {
            //Debug.DrawRay(Vector3.zero, this.contacts[0].point);

            // Simplify calls to Physics2D.Raycast, only need to specify direction of Raycast
            System.Func<Vector2, RaycastHit2D> RaycastInDir = (dir) =>
                    Physics2D.Raycast(this.contacts[0].point, dir, rayDist, this.wallMask);
            RaycastHit2D wallHit = RaycastInDir(moveDir);


            if( (wallHit.collider != null) )
            {
                // Move along x or y component of moveDir not in direction of wall
                this.clearDir = moveDir - Vector3.Project(moveDir, wallHit.normal);
                this.clearDir.Normalize();

                if( clearDir.magnitude != 0f )
                {
                    this.body.velocity = this.clearDir * this.speed;
                }

                //Debug.DrawRay(Vector3.zero, wallHit.point, Color.magenta);
                //Debug.DrawRay(this.body.position, Vector3.Project(moveDir, wallHit.normal), Color.black); 
                //Debug.DrawRay(this.body.position, this.clearDir, Color.red);
            }
        }

        /*
        Color[] alt = new Color[8] {
            Color.white, Color.yellow, Color.red, Color.blue, 
            Color.green, Color.magenta, Color.cyan, Color.black 
        };

        for(int i = 0; i < numContacts; ++i)
        {
            Debug.DrawRay(contacts[i].point, contacts[i].normal, alt[i]);
        }
        */
    }// end FixedUpdate()
}
