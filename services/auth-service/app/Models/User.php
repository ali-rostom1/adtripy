<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'phone',
        'birth_date',
        'city',
        'country',
        'last_seen_at',
        'pfp_path',
        'email_verified_at',
        'phone_verified_at',
    ];
    protected $appends = ['age'];
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }
     public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'last_seen_at' => 'datetime',
            'birth_date' => 'date'
        ];
    }

    public function getAgeAttribute(){
        if(!$this->birth_date){
           return null; 
        }
        return Carbon::parse($this->birth_date)->age;
    }
    public function name(){
        return trim($this->firstName . ' ' . $this->lastName);
    }
}
