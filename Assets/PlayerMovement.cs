using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    // CharacterController characterController;
    public float speed = 1.0f;
    public Rigidbody2D rb2d;
    private Vector2 movement = Vector2.zero;

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        // Input
        movement = new Vector2(Input.GetAxis("Horizontal"), Input.GetAxis("Vertical"));

    }

    private void FixedUpdate()
    {
        // Movement
        rb2d.MovePosition(rb2d.position + movement * speed * Time.fixedDeltaTime);

    }
}

