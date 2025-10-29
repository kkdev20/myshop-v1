<?php

namespace App\Jobs;

use App\Mail\OrderPlaced;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendOrderNotification implements ShouldQueue
{
    use Dispatchable, Queueable, SerializesModels;

    public Order $order;

    /**
     * Create a new job instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // send email to admin (uses MAIL_MAILER config; default to log driver in .env)
        $admin = env('MAIL_FROM_ADDRESS', 'hello@example.com');

        try {
            Mail::to($admin)->send(new OrderPlaced($this->order->load('items.product')));
        } catch (\Throwable $e) {
            logger()->error('Failed to send order notification: ' . $e->getMessage());
        }
    }
}
