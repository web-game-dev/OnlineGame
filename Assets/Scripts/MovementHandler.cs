using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MovementHandler : MonoBehaviour
{
    [SerializeField] private float speed = 6f;  // character walks at this constant speed
    private Vector3 moveDir;

    private Animator anim;

    void Awake()
    {
        // Initialize movement vars to 0
        this.moveDir = new Vector3(0f, 0f);
        this.anim = gameObject.GetComponent<Animator>();
    }

    // Helper function to flip direction that character is facing
    private void FlipPlayerDir()
    {
        // Flip direction that character is facing
        Vector3 tempScale = this.transform.localScale;
        tempScale.x *= -1;
        this.transform.localScale = tempScale;
    }

    // Update is called once per frame
    void Update()
    {
        this.moveDir.x = Input.GetAxisRaw("Horizontal");
        this.moveDir.y = Input.GetAxisRaw("Vertical");
        moveDir.Normalize();

        // If moveDir is non-zero, play walking animation in correct dir
        if ( moveDir.magnitude != 0f  )
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
            anim.SetBool("isWalking", true);
        } else {
            anim.SetBool("isWalking", false);
        }
 
        this.transform.position += (this.moveDir * this.speed * Time.deltaTime);
    }
}
